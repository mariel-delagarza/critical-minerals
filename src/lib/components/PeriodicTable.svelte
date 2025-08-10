<script>
	import Element from '$lib/components/Element.svelte';
	import TableButtons from './TableButtons.svelte';
	import { selectedElement } from '$lib/stores/selectedElement';
	import { onMount, onDestroy } from 'svelte';

	export let dataArray;
	export let wrapperHeight = 0;
	let activeFilter = 'all';
	let wrapperEl;
	let ro;

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

	// --- 2024 NIR helpers (sheet slots 1..3) ---
	const BIN_COLORS = {
		b0_25: '#e8f5e9',
		b26_75: '#c8e6c9',
		b76_99: '#81c784',
		b100: '#388e3c',
		bNA: '#f3f4f6'
	};

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
		// If truly no 2024 values:
		if (!bins.size) bins.add('bNA');
		return Array.from(bins); // e.g. ['b26_75'] or ['b26_75','b76_99']
	}

	// For text color: if any dark bin present, use white text
	function needsLightText(bins) {
		return bins.some((b) => b === 'b76_99' || b === 'b100');
	}
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
	<div class="periodic-grid">
		{#each dataArray as element}
			{@const isOnList =
				element['2022_doi_list'] ||
				element.doe_critical_mineral ||
				element.dla_materials_of_interest}
			<!-- get all bins for this element -->
			{@const nirBins = nirBinsForElement(element)}
			<!-- DEBUG: log bins -->
			{@html (() => {
				// console.log(element.symbol || element.name, nirBins);
				return '';
			})()}
			<button
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
		outline: 2px solid #333;
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
