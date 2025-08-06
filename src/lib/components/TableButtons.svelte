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
		font-size: 1.25rem;
		padding: 1rem 2rem;
		font-weight: bold;
		background: white;
		cursor: pointer;
		border: none;
	}

	.doi {
		background-color: #edab12;
		color: #000;
	}

	.doi:hover {
		background-color: #9d6d07;
		transition: background-color 0.3s ease;
		color: #fff;
	}

	.doe {
		background-color: #0b1d51;
		color: #fff;
	}

	.doe:hover {
		background-color: #91a0ba;
		transition: background-color 0.3s ease;
		color: #000;
	}

	.dla {
		background-color: #6e1e43;
		color: #fff;
	}

	.dla:hover {
		background-color: #bc8fa1;
		transition: background-color 0.3s ease;
		color: #000;
	}
	.all{
		/* background-color: #444; */
		background: linear-gradient(
			to bottom right,
			#edab12 33%,
			/* DOI */ #0b1d51 33% 66%,
			/* DOE */ #6e1e43 66% /* DLA */
		);
		color: #fff;
    transition: background-color 0.3s ease;
	}

	.doe.selected {
		background-color: white;
		color: black;
    outline: 3px solid #91a0ba;
	}
	.doi.selected {
		background-color: white;
		color: black;
    outline: 3px solid #9d6d07;
	}

	.doi.selected:hover {
		background-color: #9d6d07;
		color: #fff;
	}

	.dla.selected {
		background-color: white;
		color: black;
    outline: 3px solid #bc8fa1;
	}

  .dla.selected:hover {
    background-color: #bc8fa1;
    color: #000;
  }

	.all.selected {
		background: white;
		color: #000;
    outline: 3px solid #444;
	}
</style>
