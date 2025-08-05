<!--This will hold the data visualization for a selected element -->
<script>
  import ImportRelianceChart from '$lib/components/ImportRelianceChart.svelte';
  import ImportValuesChart from '$lib/components/ImportValuesChart.svelte';
  import Map from '$lib/components/Map.svelte';
</script>

<div class="detail-panel">
  <h2>Detail Panel</h2>
  <ImportRelianceChart />
  <ImportValuesChart />
  <Map />
</div>

<style>
  .detail-panel {
    outline: 1px solid red;
  }
</style>