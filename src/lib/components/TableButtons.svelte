<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let activeFilter = 'all';

	const filters = [
		{ id: 'all', label: 'All Lists' },
		{ id: 'doi', label: '2022 DOI' },
		{ id: 'doe', label: 'DOE' },
		{ id: 'dla', label: 'DLA' },
    { id: 'nir', label: 'Import Reliance (2024)' } 

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
		gap: 1rem;
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
		position: relative; /* Needed for ::before positioning */
		z-index: 0; /* Ensure pseudo-elements go behind content */
		overflow: hidden; /* Prevents gradient from spilling */
	}

	/* --------------------- DOI button --------------------- */
	.doi {
		background-color: #edab12;
		color: #000;
	}
	.doi:focus {
		outline: 3px solid #9d6d07;
		outline-offset: 3px;
	}

	.doi:hover,
	.doi.selected:hover {
		background-color: #9d6d07;
		transition: background-color 0.3s ease;
		color: #fff;
	}

	.doi.selected {
		background-color: white;
		color: black;
		outline: 3px solid #9d6d07;
	}

	/* --------------------- DOE button --------------------- */
	.doe {
		background-color: #0b1d51;
		color: #fff;
	}

	.doe:focus {
		outline: 3px solid #0b1d51;
		outline-offset: 3px;
	}

	.doe:hover,
	.doe.selected:hover {
		background-color: #91a0ba;
		transition: background-color 0.3s ease;
		color: #000;
	}

	.doe.selected {
		background-color: white;
		color: black;
		outline: 3px solid #91a0ba;
	}

	/* --------------------- DLA button --------------------- */
	.dla {
		background-color: #6e1e43;
		color: #fff;
	}

	.dla:focus {
		outline: 3px solid #6e1e43;
		outline-offset: 3px;
	}

	.dla:hover,
	.dla.selected:hover {
		background-color: #bc8fa1;
		transition: background-color 0.3s ease;
		color: #000;
	}

	.dla.selected {
		background-color: white;
		color: black;
		outline: 3px solid #bc8fa1;
	}

  /* --------------- Import Reliance Button --------------- */
	.nir {
		background-color: #074e67;
		color: #fff;
	}
	.nir:focus {
		outline: 3px solid #074e67;
		outline-offset: 3px;
	}

	.nir:hover,
	.nir.selected:hover {
		background-color: #2e8da5;
		transition: background-color 0.3s ease;
		color: #fff;
	}

	.nir.selected {
		background-color: white;
		color: black;
		outline: 3px solid #2e8da5;
	}


	/* -------------------- "All" button -------------------- */
	.all {
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

	.all:focus {
		outline: 3px solid #444;
		outline-offset: 3px;
	}

	.all.selected {
		background: white;
		color: #000;
		outline: 3px solid #444;
		position: relative; /* You missed this */
		z-index: 0;
	}

	.all.selected:hover {
		color: #000;
	}

	.all.selected::before {
		content: '';
		color: #fff;
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom right, #edab12 33%, #91a0ba 33% 66%, #bc8fa1 66%);
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: -1; /* Ensures it's behind button content */
	}

	.all.selected:hover::before {
		opacity: 1;
		color: #fff;
	}
</style>
