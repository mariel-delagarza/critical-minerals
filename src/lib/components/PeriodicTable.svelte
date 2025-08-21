<script>
  import Element from '$lib/components/Element.svelte';
  import TableButtons from './TableButtons.svelte';
  import { selectedElement } from '$lib/stores/selectedElement';
  import { onMount, onDestroy } from 'svelte';

  export let dataArray;
  export let wrapperHeight = 0;

  let activeFilter = 'all';
  let selectedCountry = ''; // ← country from the dropdown
  let wrapperEl, ro;

  // normalize for safe comparisons
  const norm = (s) => (s == null ? '' : String(s).replace(/\s+/g, ' ').trim());

  function setFilter(filter) {
    activeFilter = filter;
  }

  function shouldHighlight(element) {
    // We dim/outline via classes; highlight stays true unless list filters say otherwise
    if (selectedCountry) return true;
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

  function nirBinsForElement(el) {
    const bins = new Set(
      Object.values(el?.materials ?? {})
        .map((m) => toNum(m?.['2024']?.value))
        .filter((v) => Number.isFinite(v))
        .map(binFor)
    );
    return Array.from(bins);
  }

  function isNetExporter(el) {
    return Object.values(el?.materials ?? {}).some((m) => m?.['2024']?.netExporter === true);
  }

  function isNotAvailable(el) {
    const mats = Object.values(el?.materials ?? {});
    if (!mats.length) return false; // your old bNA case is separate
    return mats.every((m) => m?.['2024']?.value == null);
  }

  function matchesCountry(el) {
    if (!selectedCountry) return true;
    return norm(el?.primary_import_source_1) === norm(selectedCountry);
  }

  // Build the dropdown list from your data (you said you already do this; keeping here for completeness)
  $: importCountries = new Set(
    (dataArray ?? []).map((el) => norm(el?.primary_import_source_1)).filter(Boolean)
  );

  // Row-major sort so Tab follows the grid
  $: dataArraySorted = (dataArray ?? []).slice().sort((a, b) => {
    if (a.ypos !== b.ypos) return a.ypos - b.ypos;
    return a.xpos - b.xpos;
  });

  onMount(() => {
    const update = () => (wrapperHeight = wrapperEl?.clientHeight ?? 0);
    update();
    ro = new ResizeObserver(update);
    ro.observe(wrapperEl);
  });
  onDestroy(() => ro?.disconnect());
</script>

<div class="table-wrapper periodic-table" bind:this={wrapperEl}>
  <TableButtons
    {activeFilter}
    {importCountries}
    on:filterChange={(e) => {
      // normal filter buttons
      selectedCountry = '';        // clear country if user switches filters
      setFilter(e.detail.id);
    }}
    on:countryChange={(e) => {
      // dropdown selection
      selectedCountry = e.detail.country || '';
    }}
  />

  {#if activeFilter === 'nir' && !selectedCountry}
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
      {@const onDOI = !!element['2022_doi_list']}
      {@const onDOE = !!element.doe_critical_mineral}
      {@const onDLA = !!element.dla_materials_of_interest}
      {@const onAny = onDOI || onDOE || onDLA}

      <!-- Enable only when the element matches the CURRENT list filter -->
      {@const enabled =
        activeFilter === 'doi' ? onDOI :
        activeFilter === 'doe' ? onDOE :
        activeFilter === 'dla' ? onDLA :
        activeFilter === 'nir' ? onAny :  /* in NIR, use the "in scope" set */
        /* 'all' or default */   onAny}

      <!-- NIR bins are independent of the DOE/DOI/DLA view -->
      {@const nirBins =
        isNetExporter(element)                ? ['bNEG']   :
        (onAny && isNotAvailable(element))    ? ['bNotAv'] :
        onAny                                 ? nirBinsForElement(element) :
                                                ['bNA']}

      <button
        type="button"
        class="cell
               {activeFilter === 'nir' ? `nir ${nirBins.join(' ')}` : ''}
               {!enabled ? 'is-disabled' : ''}
               {selectedCountry && enabled && !matchesCountry(element) ? 'is-dim' : ''}
               {selectedCountry && enabled &&  matchesCountry(element) ? 'is-match' : ''}"
        style="grid-column:{element.xpos}; grid-row:{element.ypos};"
        on:click={() => enabled && selectedElement.set(element)}
        aria-label={enabled ? `Select ${element.name}` : `${element.name} (not selectable)`}
        disabled={!enabled}
      >
        <Element {element} {activeFilter} highlight={shouldHighlight(element)} {nirBins} />
      </button>
    {/each}
  </div>
</div>

<style>
  .cell {
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: block;
  }
  .cell:disabled { color: #808080; }

  .cell:focus-visible {
    outline: 3px solid #0ea5e9;
    outline-offset: 2px;
  }

  /* Country highlighting */
  .cell.is-dim   { opacity: .25; }
  .cell.is-match { outline: 3px solid #2e8da5; outline-offset: -2px; }

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
    display: flex; gap: 1rem; list-style: none; padding: 0; margin: 0.25rem 0 0; flex-wrap: wrap; align-items: center;
  }
  .nir-legend .swatch { display:inline-block; width:1rem; height:1rem; border-radius:2px; margin-right:0.4em; box-shadow:0 0 1px rgba(0,0,0,0.3); vertical-align:middle; }
  .nir-legend .b0_25 { background:#b2dfee; }
  .nir-legend .b26_75 { background:#6fbfd5; }
  .nir-legend .b76_99 { background:#2e8da5; }
  .nir-legend .b100 { background:#074e67; }
  .nir-legend .bNotAv { background:#ccc; border:1px solid #d1d5db; }
  .nir-legend .bNEG { background:#ccc; }

  @container table (max-width: 1400px) { .periodic-grid { --cell: 3.25rem; } }
  @container table (max-width: 1200px) { .periodic-grid { --cell: 3rem; } }
  @container table (max-width: 1050px) { .periodic-grid { --cell: 2.75rem; } }

  @container table (max-width: 980px) {
    .table-wrapper { overflow-x: auto; }
    .periodic-grid { width: max-content; min-width: 100%; }
  }
  @media (max-width: 1100px) {
    .table-wrapper { overflow-x: auto; }
    .periodic-grid { width: max-content; min-width: 100%; }
  }
  @media (max-width: 700px) {
    .table-wrapper { overflow-x: auto; max-width: 100%; }
    .periodic-grid { width: max-content; }
  }
</style>
