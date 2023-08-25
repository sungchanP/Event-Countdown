import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import Store from './stores.js';

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

app.get('/upcoming', async(req,res) => {
    const allEvents = await Store.read();
    let upcomingEvents = {};

    for(let [_, event] of Object.entries(allEvents)){
        let daysLeft = daysDiff(event.date);
        event.ddays = daysLeft;
        if (daysLeft > 0){
            upcomingEvents[event.id] = {id:event.id, date:event.date, title:event.title, ddays:event.ddays}
        }
    }
    await Store.write(allEvents);

    console.log(`(${process.pid}) Query Event Service (getting upcoming events): ${JSON.stringify(upcomingEvents)}`);
    res.send(upcomingEvents);
});

app.get('/past', async(req,res) => {
    const allEvents = await Store.read();
    let pastEvents = {};

    for(let [_, event] of Object.entries(allEvents)){
        let daysLeft = daysDiff(event.date);
        event.ddays = daysLeft;
        if (daysLeft < 0){
            pastEvents[event.id] = {id:event.id, date:event.date, title:event.title, ddays:event.ddays*(-1)}
        }
    }
    await Store.write(allEvents);
    
    console.log(`(${process.pid}) Query Event Service (getting past events): ${JSON.stringify(pastEvents)}`);
    res.send(pastEvents);
});

app.get('/today', async(req,res)=>{
    const allEvents = await Store.read();
    let todayEvents = {};

    for(let [_, event] of Object.entries(allEvents)){
        let daysLeft = daysDiff(event.date);
        event.ddays = daysLeft;
        if (daysLeft === 0){
            todayEvents[event.id] = {id:event.id, date:event.date, title:event.title, ddays:event.ddays}
        }
    }
    await Store.write(allEvents);

    console.log(`(${process.pid}) Query Event Service (getting today's events): ${JSON.stringify(todayEvents)}`);
    res.send(todayEvents);

})

app.post('/events', async(req,res) => {
    const {type, data} = req.body;
    const allEvents = await Store.read();
    const {id, date, title, ddays} = data;

    if (type === 'UpcomingCreated') {
        allEvents[id] = {id, date, title, ddays};
    }

    if (type === 'UpcomingDeleted') {
        delete allEvents[id];
    }
    
    await Store.write(allEvents);
    console.log(`(${process.pid}) Query Service Received Event: ${type}`);
    res.send({status : 'ok'}) 
})

app.listen(4002, ()=>{
    console.log(`(${process.pid}) Query Service running on 4002`);
})