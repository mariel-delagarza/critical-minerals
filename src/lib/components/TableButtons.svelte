<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let activeFilter = 'all';
	export let importCountries; // Set<string>
	export let selectedCountry = '';

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

	const norm = (s) => (s == null ? '' : String(s).replace(/\s+/g, ' ').trim());

	// turn the Set into a sorted array of strings
	$: countries = Array.from(importCountries ?? [])
		.map(norm)
		.filter(Boolean)
		.sort(new Intl.Collator('en').compare);

	function changeCountry(e) {
		dispatch('countryChange', { country: e.target.value || '' });
	}

	function clearCountry() {
		dispatch('countryChange', { country: '' });
	}
</script>

<div class="table-buttons">
	{#each filters as { id, label }}
		<button class="{id} {activeFilter === id ? 'selected' : ''}" on:click={() => changeFilter(id)}>
			{label}
		</button>
	{/each}
	<!-- Select + clear button wrapper -->
	<div class="select-wrap" class:hasValue={!!selectedCountry}>
		<select
			id="primaryImportSources"
			name="primaryImportSources"
			class="select"
			on:change={changeCountry}
			value={selectedCountry}
			aria-label="Filter by country"
		>
			<option value="">Filter by country…</option>
			{#each countries as country}
				<option value={country}>{country}</option>
			{/each}
		</select>

		{#if selectedCountry}
			<button
				type="button"
				class="clear-select"
				aria-label="Clear country filter"
				title="Clear country filter"
				on:click={clearCountry}
			>
				✕
			</button>
		{/if}
	</div>
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

	/* --------------- Primary Import Sources --------------- */

	/* Select wrapper positions the clear button */
	.select-wrap {
		position: relative;
		display: inline-block;
	}

	/* Style the closed control (can't style the open OS menu) */
	.select {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
		background-color: #5a175d;
		color: #fff;
		border-radius: 0;
		border: 0;
		font-size: 1.25rem;
		font-weight: 700;
		line-height: 1;
		padding: 1rem 3rem 1rem 2rem; /* room on right for clear button */
		background-clip: padding-box;
		/* custom caret */
		background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 20 20' fill='white'><path d='M5.5 7.5l4.5 4.5 4.5-4.5z'/></svg>");
		background-repeat: no-repeat;
		background-position: right 0.9rem center;
		background-size: 12px;
	}
	/* when a value is selected (the ✕ shows), remove the caret */
	.select-wrap.hasValue .select {
		background-image: none;
		/* optional: tighten right padding now that there’s no caret behind the ✕ */
		padding-right: 2.25rem;
	}
	.select:hover {
		background-color: #9a729c;
	}
	.select:focus {
		outline: 3px solid #9a729c;
		outline-offset: 3px;
	}

	/* The clear button */
	.clear-select {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		line-height: 1;
		border: 0;
		border-radius: 999px;
		padding: 0.15rem 0.45rem;
		background: rgba(255, 255, 255, 0.15);
		color: #fff;
		cursor: pointer;
	}
	.clear-select:hover {
		background: rgba(255, 255, 255, 0.3);
	}
	.clear-select:focus {
		outline: 2px solid #fff;
		outline-offset: 2px;
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
