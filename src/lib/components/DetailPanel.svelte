<script>
	import ImportRelianceChart from '$lib/components/ImportRelianceChart.svelte';
	import ImportValuesChart from '$lib/components/ImportValuesChart.svelte';
	import AllValuesChart from './AllValuesChart.svelte';
	import Map from '$lib/components/Map.svelte';
	import { selectedElement } from '$lib/stores/selectedElement';

	export let allElements = [];
	console.log(allElements.data);
	$: text = $selectedElement?.notes;
	$: name = $selectedElement?.name;
	$: selectedSymbol = $selectedElement?.symbol ?? null;

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
	{#if $selectedElement}
		<h2>{name}</h2>
		<p>{name} is on the critical minerals {listStatement}. {@html text}</p>

		<h3>Uses</h3>
		{#each Object.entries($selectedElement.materials) as [materialName, materialData]}
			{#if materialData.applications}
				<details>
					<summary>{materialName}</summary>
					<ul>
						{#each materialData.applications.split(';').map((a) => a.trim()) as app}
							<li>{app}</li>
						{/each}
					</ul>
				</details>
			{/if}
		{/each}

		<AllValuesChart mode="all" elements={allElements.data} selectedElement={$selectedElement} {selectedSymbol} />
		<div id="charts">
			<ImportRelianceChart element={$selectedElement} />
		</div>
	{:else}
		<p>
			Click on an element in the table to see details including its uses, the U.S. net import reliance,
			and countries it is imported from.
		</p>
	{/if}
</div>


<style>
	.detail-panel {
		padding: 2rem;
	}

	p {
    font-size: 1.25rem;
  }
</style>
