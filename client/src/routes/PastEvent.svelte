<script>
    import { onMount } from "svelte";
    import {PastStore} from './store';
    let events = {};
    onMount(async()=>{
        const eventRes = await fetch("http://localhost:4002/past");
        const eventData = await eventRes.json();
        PastStore.set(eventData);
    });

    PastStore.subscribe((_events) => {
        events = _events;
    });

</script>

<p>Past events</p>
<ul>
    {#each Object.entries(events) as [_, event] (event.id)}
        <li>
            {event.title} on {event.date}
            <p>
                D+{event.ddays}
            </p>
        </li>
    {/each}
    
</ul>