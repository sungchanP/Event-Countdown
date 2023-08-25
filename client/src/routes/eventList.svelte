<script>
    import { onMount } from "svelte";
    import {UpcomingStore} from './store';
    let events = {};
    onMount(async()=>{
        const eventRes = await fetch("http://localhost:4002/upcoming");
        const eventData = await eventRes.json();
        UpcomingStore.set(eventData);
    });

    UpcomingStore.subscribe((_events) => {
        events = _events;
    });

    const deleteEvent = async(id) => {
        const res = await fetch("http://localhost:4000/upcoming" , {
            method: 'DELETE',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({id})
        });
        const eventRes = await fetch("http://localhost:4002/upcoming");
        const eventData = await eventRes.json();
        UpcomingStore.set(eventData);
    }

</script>

<p>Upcoming events</p>
<ul>
    {#each Object.entries(events) as [_, event] (event.id)}
        <li>
            {event.title} on {event.date} <button on:click={()=>deleteEvent(event.id)}>Delete</button>
            <p>
                D-{event.ddays}
            </p>
        </li>
    {/each}
    
</ul>