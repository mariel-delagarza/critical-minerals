<script>
  import Filters from '$lib/components/Filters.svelte';
  import Legend from '$lib/components/Legend.svelte';
  import PeriodicTable from '$lib/components/PeriodicTable.svelte';
  import DetailPanel from '$lib/components/DetailPanel.svelte';
  import { onMount } from 'svelte';
  import {getData} from '$lib/data.js'; // Assuming you have a data fetching function

  let rawData = [];

  onMount(async () => {
    rawData = await getData();
    console.log("Fetched data in Main component:", rawData); // <--- should be full array
  });

  $: data = rawData
</script>

<div class="main-layout">
  <div class="top-row">
    <Filters />
    <Legend />
  </div>

  <div class="content-row">
    <PeriodicTable {data} />
    <DetailPanel />
  </div>
</div>

<style>
  .main-layout {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .top-row {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .content-row {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    align-items: flex-start;
    flex-wrap: wrap;
  }

  :global(.periodic-table) {
    flex: 2 1 60%;
    min-width: 300px;
    outline: 2px dashed red;
  }

  :global(.detail-panel) {
    flex: 1 1 35%;
    min-width: 250px;
    outline: 2px dashed red;
  }

  :global(.filters) {
    display: none;
  }

  :global(.legend) {
    margin-left: auto;
    outline: 2px dashed red;
  }

  /* Mobile styles */
  @media (max-width: 768px) {
    .content-row {
      flex-direction: column;
    }

    :global(.filters) {
      display: block;
      outline: 2px dashed red;
    }

    :global(.periodic-table),
    :global(.detail-panel) {
      flex: 1 1 100%;
    }

    :global(.legend) {
      margin-left: 0;
    }
  }
</style>
