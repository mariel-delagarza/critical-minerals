<script>
	import ImportRelianceChart from '$lib/components/ImportRelianceChart.svelte';
	import ImportValuesChart from '$lib/components/ImportValuesChart.svelte';
	import Map from '$lib/components/Map.svelte';
	import { selectedElement } from '$lib/stores/selectedElement';

	$: text = $selectedElement?.notes;
	$: name = $selectedElement?.name;

	/* Put together statement about what lists element is on*/
	let doi_label = 'Department of Interior';
	let doe_label = 'Department of Energy';
	let dla_label = 'Defense Logistics Agency';
	$: agencies = [
		$selectedElement?.['2022_doi_list'] && 'Department of the Interior',
		$selectedElement?.doe_critical_mineral && 'Department of Energy',
		$selectedElement?.dla_materials_of_interest && 'Defense Logistics Agency'
	].filter(Boolean);
	function makeListStatement(agencies) {
		if (agencies.length == 1) {
			return `list of the ${agencies[0]}`;
		} else if (agencies.length == 2) {
			return `lists of ${agencies[0]} and the ${agencies[1]}`;
		} else if (agencies.length == 3) {
			return `lists of the ${agencies[0]}, the ${agencies[1]}, and the ${agencies[2]}`;
		}
	}
	$: listStatement = makeListStatement(agencies);
</script>

<div class="detail-panel">
	<h2>{name}</h2>
	<p>{name} is on the critical minerals {listStatement}. {text} </p>
	{#if $selectedElement}
		{#each Object.entries($selectedElement.materials) as [materialName, materialData]}
			{#if materialData.applications}
				<h3>{materialName}</h3>
				<ul>
					{#each materialData.applications.split(';').map((a) => a.trim()) as app}
						<li>{app}</li>
					{/each}
				</ul>
			{/if}
		{/each}
	{/if}
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
		padding: 2rem;
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
