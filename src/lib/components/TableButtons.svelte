<!-- src/lib/components/TableButtons.svelte -->
<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let activeFilter = 'all';

	const filters = [
		{ id: 'all', label: 'All Lists' },
		{ id: 'doi', label: '2022 DOI' },
		{ id: 'doe', label: 'DOE' },
		{ id: 'dla', label: 'DLA' }
	];

	function changeFilter(id) {
		dispatch('filterChange', { id });
	}
</script>

<div class="table-buttons">
	{#each filters as { id, label }}
		<button class="{id} {activeFilter === id ? 'selected' : ''}" on:click={() => changeFilter(id)}>
			{label}
		</button>
	{/each}
</div>

<style>
	.table-buttons {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
		margin-top: 1rem;
	}

	button {
		font-size: 1rem;
		padding: 0.5rem 1rem;
		font-weight: bold;
		background: white;
		cursor: pointer;
    border: none;
	}

	.doi {
		background-color: #edab12;
		color: #000;
	}
	.doe {
		background-color: #0b1d51;
		color: #fff;
	}
	.dla {
		background-color: #5a175d;
		color: #fff;
	}
	.all {
		background-color: #444;
		color: #fff;
	}

	.doe.selected {
		background-color: white;
		color: black;
	}
	.doi.selected {
		background-color: white;
		color: black;
	}
	.dla.selected {
		background-color: white;
		color: black;
	}

  .all.selected {
    background-color: white;
    color: black;
  }
</style>
