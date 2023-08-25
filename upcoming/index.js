import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import Store from './stores.js';
import {randomBytes} from "crypto";

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

const daysDiff = (date) =>{
    const tdy = new Date();
    const eventDate = new Date(date);
    let diff = eventDate.getTime() - tdy.getTime();
    let res = Math.ceil(diff / (1000 * 3600 * 24));
    return res;
}

app.get("/upcoming", async(req,res) => {
    // Get current list of upcoming events from store
    const upcomingEvents = await Store.read();
    for(let [id, event] of Object.entries(upcomingEvents)){
        let daysLeft = daysDiff(event.date);
        if (daysLeft <= 0){
            delete upcomingEvents[id];
        }
        else{
            event.ddays = daysLeft;
        }
    }
    await Store.write(upcomingEvents);
    res.send(upcomingEvents);
});

app.post("/upcoming", async(req, res) => {
    const id = randomBytes(4).toString('hex');
    const {date, title} = req.body;
    const ddays = daysDiff(date);
    
    const upcomingEvents = await Store.read();
    upcomingEvents[id] = {id, date, title, ddays}

    try {
        await fetch('http://eventbus:4005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "UpcomingCreated",
                data: {
                    id,
                    date,
                    title,
                    ddays
                },
            }),
        });
    } catch (err) {
        console.log(`(${process.pid}) Upcoming Create Service: ${err}`);
        res.status(500).send({
            status: 'ERROR',
            message: err,
        });
    }

    await Store.write(upcomingEvents);
    console.log(`(${process.pid}) Upcoming Event Service: ${JSON.stringify(upcomingEvents)}`);
    res.status(201).send(upcomingEvents[id]);
    
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;
    console.log(`(${process.pid}) Upcoming Service Received Event: ${type}`);
    res.send({});
});


app.delete('/upcoming', async(req, res) => {
    const {id} = req.body;
    const upcomingEvents = await Store.read();
    delete upcomingEvents[id];
    try {
        await fetch('http://eventbus:4005/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                type: "UpcomingDeleted",
                data: {
                    id,
                },
            }),
        });
    } catch (err) {
        console.log(`(${process.pid}) Upcoming Delete Service: ${err}`);
        res.status(500).send({
            status: 'ERROR',
            message: err,
        });
    }
    await Store.write(upcomingEvents);
    res.sendStatus(200);
});



app.listen(4000, ()=>{
    console.log(`(${process.pid}) Upcoming Event Service running on 4000`);
})