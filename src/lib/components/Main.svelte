<script>
	import Filters from '$lib/components/Filters.svelte';
	import Legend from '$lib/components/Legend.svelte';
	import PeriodicTable from '$lib/components/PeriodicTable.svelte';
	import DetailPanel from '$lib/components/DetailPanel.svelte';

	export let data;
	const dataArray = data.data; // original data comes as object from +page.js
	let wrapperHeight = 0; // comes from PeriodicTable

	let selected = null;
	function handleSelect(e) {
		selected = e.detail; // an element object
	}

  	// Build rare earth list (excluding Scandium & Yttrium)
	const rareEarthNames = dataArray
		.filter(el => el.rare_earth === true && el.name !== 'Scandium' && el.name !== 'Yttrium')
		.map(el => el.name);
</script>

<div class="main-layout">
	<div class="top-row">
		<Filters />
		<Legend />
	</div>
	<div class="content-row" style={`--row-h: ${wrapperHeight}px`}>
		<PeriodicTable {rareEarthNames} {dataArray} on:selectElement={handleSelect} bind:wrapperHeight />
		<DetailPanel {selected} allElements={data} />
	</div>
</div>

<style>
	:global(html) {
		box-sizing: border-box;
	}

	:global(*),
	:global(*::before),
	:global(*::after) {
		box-sizing: inherit;
	}
	:global(body) {
		font-family: 'Roboto', sans-serif;
		margin: 0;
		overflow: auto;
		background: #eee6d8;
	}

	.main-layout {
		display: flex;
		flex-direction: column;
		/* max-width: 1900px; */
		margin-inline: auto;
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
		gap: 1rem;
		align-items: stretch;
    width: 100%;
	}
	:global(.periodic-table) {
		flex: 3 1 0;
		min-width: 0;
		/* outline: 2px dashed red; */
		min-height: 0;
		overflow-x: auto;
	}
  	:global(.detail-panel) {
		flex: 2 1 0;
		min-width: 400px;
		/* outline: 2px dashed purple; */
		height: var(--row-h);
		overflow-y: auto;
	}

	:global(.filters) {
		display: none;
	}

	:global(.legend) {
		margin-left: auto;
		/* outline: 2px dashed red; */
	}

	/* ------------------------------------------------------ */
	/*                         Mobile                         */
	/* ------------------------------------------------------ */
	@media (min-width: 1900px) {
    :global(.detail-panel) {
      max-width: 38%; 
    }
	}

	@media (max-width: 1300px) {
		:global(body) {
			overflow: auto;
		}
	}

	@media (max-width: 1100px) {
		.content-row {
			flex-direction: column;
		}

		:global(.filters) {
			display: block;
			/* outline: 2px dashed red; */
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
