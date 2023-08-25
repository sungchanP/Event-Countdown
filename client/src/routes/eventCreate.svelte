<script>
    import { UpcomingStore } from "./store.js";
    const dt = new Date();
    const startDate = dt.getFullYear() + "-" + String(dt.getMonth()+1).padStart(2, '0') + "-" + (dt.getDate()+1);

    let title = "";
    let date = "";

    const createEvent = async(event) =>{
        event.preventDefault();
        const res = await fetch("http://localhost:4000/upcoming", {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({date, title})
        });
        const data = await res.json();
        title = "";
        UpcomingStore.update((events) => {
            return { ...events, [data.id]: data };
        });

    }

</script>

<form on:submit={createEvent}>
    <div class="input-group">
        <div class="w-25">
            <label for="calendar" >Event Date:</label>
            <input type="date" name="calendar" class="form-control" min={startDate} bind:value={date}>
        </div>
        <div class="w-50">
            <label for="title">Event Title:</label>
            <input type="text" name="title" class="form-control" bind:value={title}>
        </div>
        <br>
        <button class="btn btn-success" on:submit={createEvent}>Create Event</button>
    </div>
</form>