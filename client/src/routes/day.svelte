<script>
    import { onMount } from "svelte";
    let date = new Date();

    let dateStr = date.getFullYear() + "-" + String(date.getMonth()+1).padStart(2, '0') + "-" + date.getDate();
    let eventName = [];

    onMount(async()=>{
        const eventRes = await fetch("http://localhost:4002/today");
        const eventData = await eventRes.json();
        for (let [_, event] of Object.entries(eventData) ){
            eventName.push(event.title);
            eventName = eventName;
        }
    });


</script>

<h1>Today is {dateStr}</h1>
<h2>D-Day for {eventName}</h2>
