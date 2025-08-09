<script>
	import Element from '$lib/components/Element.svelte';
	import TableButtons from './TableButtons.svelte';
  	import { selectedElement } from '$lib/stores/selectedElement';


	export let dataArray;
	let activeFilter = 'all';

	function setFilter(filter) {
		activeFilter = filter;
		console.log('New filter selected:', activeFilter);
	}

	function shouldHighlight(element) {
		if (activeFilter === 'all') return true;
		if (activeFilter === 'doi') return element['2022_doi_list'];
		if (activeFilter === 'doe') return element.doe_critical_mineral;
		if (activeFilter === 'dla') return element.dla_materials_of_interest;
		return false;
	}
</script>

<div class="table-wrapper">
	<TableButtons {activeFilter} on:filterChange={(e) => setFilter(e.detail.id)} />
	<div class="periodic-grid">
		{#each dataArray as element}
			<button
				class="cell"
				style="grid-column: {element.xpos}; grid-row: {element.ypos};"
				on:click={() => selectedElement.set(element)}
				aria-label="Select {element.name}"
			>
				<Element {element} {activeFilter} highlight={shouldHighlight(element)} />
			</button>
		{/each}
	</div>
</div>

<style>
	/* Make cells keyboard-accessible without messing styles */
	.cell {
		padding: 0;
		border: 0;
		background: transparent;
		cursor: pointer;
	}
	.cell:focus-visible {
		outline: 2px solid #333;
	}
	.table-wrapper {
		outline: 1px solid green;
	}
	.periodic-grid {
		display: grid;
		grid-template-columns: repeat(18, minmax(0, 1fr));
		grid-template-rows: repeat(10, auto);
		gap: 0.25rem;
		padding: 1rem;
		outline: 1px solid blue;
	}

	@media (max-width: 700px) {
		.table-wrapper {
			overflow-x: auto;
			max-width: 100%;
		}

		.periodic-grid {
			width: max-content;
		}
	}
</style>
