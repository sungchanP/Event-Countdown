import express from 'express';
import cors from 'cors';
import logger from 'morgan';

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

const servicePorts = [
    {name: 'upcoming', port: 4000},
    {name: 'query', port: 4002}
];

app.post("/events", async(req,res) => {
    const event = req.body;
    console.log(`(${process.pid}) Event Bus (Received Event) ${event.type}`);
  
    for (const {name, port} of servicePorts) {
        try {
            console.log(`(${process.pid}) Event Bus (Sending Event to ${port}) ${event.type}`);

            await fetch(`http://${name}:${port}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event),
            });
        } catch (err) {
            console.log(err);
        }
    }
  
    res.send({ status: 'OK' });
});

app.listen(4005, ()=>{
    console.log(`(${process.pid}) Event Bus Service running on 4005`);
})