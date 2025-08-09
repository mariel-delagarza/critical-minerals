<script>
	import ImportRelianceChart from '$lib/components/ImportRelianceChart.svelte';
	import ImportValuesChart from '$lib/components/ImportValuesChart.svelte';
	import Map from '$lib/components/Map.svelte';
	import { selectedElement } from '$lib/stores/selectedElement';
</script>

<div class="detail-panel">
	<h2>Detail Panel</h2>
	{#if $selectedElement}
		<!-- <Map element={$selectedElement} /> -->
		<div id="charts">
			<ImportValuesChart element={$selectedElement} />
			<ImportRelianceChart element={$selectedElement} />
		</div>
	{/if}
</div>

<style>
	.detail-panel {
		outline: 1px solid red;
	}

	/* #charts {
		display: flex;
		gap: 1rem;
		align-items: stretch;
	}
	#charts > * {
		flex: 1 1 0; 
		min-width: 0; 
	} */
</style>
