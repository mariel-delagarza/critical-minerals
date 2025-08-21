<script>
	import Element from '$lib/components/Element.svelte';
	import TableButtons from './TableButtons.svelte';
	import { selectedElement } from '$lib/stores/selectedElement';
	import { onMount, onDestroy } from 'svelte';

	export let dataArray;
	export let rareEarthNames;
	export let wrapperHeight = 0;
	let activeFilter = 'all';
	let wrapperEl;
	let ro;

	console.log(rareEarthNames);
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

	const toNum = (v) => (v == null || v === '' ? null : +`${v}`.replace('%', ''));

	function binFor(pct) {
		if (pct === null) return 'bNA';
		if (pct === 100) return 'b100';
		if (pct <= 25) return 'b0_25';
		if (pct > 75) return 'b76_99';
		return 'b26_75';
	}

	// Return DISTINCT bins present for this element across materials (2024)
	function nirBinsForElement(el) {
		const bins = new Set(
			Object.values(el?.materials ?? {})
				.map((m) => toNum(m?.['2024']?.value))
				.filter((v) => Number.isFinite(v))
				.map(binFor)
		);
		return Array.from(bins); // no fallback here
	}

	function isNetExporter(el) {
		return Object.values(el?.materials ?? {}).some((m) => m?.['2024']?.netExporter === true);
	}

	function isNotAvailable(el) {
		const mats = Object.values(el?.materials ?? {});
		// Do NOT treat "no materials" as Not Available — that's your existing bNA case.
		if (!mats.length) return false;

		// Return true only if EVERY material’s 2024 value is null/undefined
		return mats.every((m) => m?.['2024']?.value == null);
	}

	// ✅ Sort for keyboard tab order (row-major: y then x). Visual positions stay via grid-row/column.
	$: dataArraySorted = (dataArray ?? []).slice().sort((a, b) => {
		if (a.ypos !== b.ypos) return a.ypos - b.ypos;
		return a.xpos - b.xpos;
	});

	onMount(() => {
		const update = () => (wrapperHeight = wrapperEl?.clientHeight ?? 0);
		update(); // initial
		ro = new ResizeObserver(update);
		ro.observe(wrapperEl);
	});
	onDestroy(() => ro?.disconnect());
</script>

<div class="table-wrapper periodic-table" bind:this={wrapperEl}>
	<TableButtons {activeFilter} on:filterChange={(e) => setFilter(e.detail.id)} />

	{#if activeFilter === 'nir'}
		<div class="nir-legend">
			<strong>Net Import Reliance (2024):</strong>
			<ul>
				<li><span class="swatch b0_25"></span> 0–25%</li>
				<li><span class="swatch b26_75"></span> 26–75%</li>
				<li><span class="swatch b76_99"></span> 76–99%</li>
				<li><span class="swatch b100"></span> 100%</li>
				<li><span class="swatch bNotAv"></span> No 2024 data</li>
				<li><span class="swatch bNEG"></span> Net exporter</li>
			</ul>
		</div>
	{/if}

	<div class="periodic-grid">
		{#each dataArraySorted as element}
			{@const isOnList =
				element['2022_doi_list'] ||
				element.doe_critical_mineral ||
				element.dla_materials_of_interest}

			<!-- get all bins for this element -->
			{@const nirBins = isNetExporter(element)
				? ['bNEG']
				: isOnList && isNotAvailable(element)
					? ['bNotAv']
					: isOnList
						? nirBinsForElement(element)
						: ['bNA']}

			<!-- DEBUG: log bins (kept as no-op) -->
			{@html (() => {
				// console.log(element.symbol || element.name, nirBins);
				return '';
			})()}

			<button
				type="button"
				class="cell {activeFilter === 'nir' ? `nir ${nirBins.join(' ')}` : ''}"
				style="grid-column: {element.xpos}; grid-row: {element.ypos};"
				on:click={() => selectedElement.set(element)}
				aria-label={isOnList ? `Select ${element.name}` : `${element.name} (not selectable)`}
				disabled={!isOnList}
			>
				<Element {element} {activeFilter} highlight={shouldHighlight(element)} {nirBins} />
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
		width: 100%;
		height: 100%;
		display: block;
	}

	.cell:disabled {
		color: #808080;
	}

	.cell:focus-visible {
		outline: 3px solid #0ea5e9; /* tweak to your palette */
		outline-offset: 2px;
	}

	.table-wrapper {
		outline: 1px solid green;
		container-type: inline-size;
		container-name: table;
	}

	.periodic-grid {
		display: grid;
		--cell: 3.75rem;
		--cell-min: 2.75rem;
		grid-template-columns: repeat(18, minmax(var(--cell-min), 1fr));
		grid-template-rows: repeat(10, auto);
		gap: 0.25rem;
		padding: 1rem;
		outline: 1px solid blue;
		width: 100%;
	}

	.nir-legend {
		margin: 0 auto;
		padding: 0.75rem 1rem;
		background: #fff;
		border: 1px solid #ccc;
		border-radius: 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
		font-size: 0.875rem;
		line-height: 1.4;
		width: fit-content;
	}

	.nir-legend ul {
		display: flex;
		gap: 1rem;
		list-style: none;
		padding: 0;
		margin: 0.25rem 0 0;
		flex-wrap: wrap;
		align-items: center;
	}

	.nir-legend .swatch {
		display: inline-block;
		width: 1rem;
		height: 1rem;
		border-radius: 2px;
		margin-right: 0.4em;
		box-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
		vertical-align: middle;
	}

	.nir-legend .b0_25 {
		background: #b2dfee;
	}
	.nir-legend .b26_75 {
		background: #6fbfd5;
	}
	.nir-legend .b76_99 {
		background: #2e8da5;
	}
	.nir-legend .b100 {
		background: #074e67;
	}

	.nir-legend .bNotAv {
		background: #ccc; /* light gray */
		border: 1px solid #d1d5db; /* optional hairline */
	}

	.nir-legend .bNEG {
		background: #ccc;
	}

	.bNEG {
		background-color: #888 !important;
		color: #000;
	}

	/* Container queries: adjust tile size as the table column gets narrower */
	@container table (max-width: 1400px) {
		.periodic-grid {
			--cell: 3.25rem;
		} /* ~52px */
	}
	@container table (max-width: 1200px) {
		.periodic-grid {
			--cell: 3rem;
		} /* 48px */
	}
	@container table (max-width: 1050px) {
		.periodic-grid {
			--cell: 2.75rem;
		} /* 44px (AA floor) */
	}

	@container table (max-width: 980px) {
		.table-wrapper {
			overflow-x: auto;
		}
		.periodic-grid {
			width: max-content;
			min-width: 100%;
		}
	}

	@media (max-width: 1100px) {
		.table-wrapper {
			overflow-x: auto;
		}
		.periodic-grid {
			width: max-content;
			min-width: 100%;
		}
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
