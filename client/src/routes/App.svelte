<script>
    import Day from './day.svelte';
    import EventCreate from './eventCreate.svelte';
    import EventList from './eventList.svelte';
    import PastEvent from './PastEvent.svelte';

</script>

<Day />
<EventCreate/>
<br>
<div class="container-fluid">
    <div class="row">
        <div class="col-lg-4">
            <EventList/>
        </div>
        <br>
        <div class="col-lg-4">
            <PastEvent/>
        </div>
    </div>

</div>

