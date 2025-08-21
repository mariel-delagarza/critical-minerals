<script>
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let element;

  const toNum = (v) => {
    if (v == null || v === '') return null;
    const n = typeof v === 'string' ? parseFloat(v.replace('%','')) : +v;
    return Number.isFinite(n) ? n : null;
  };

  function sortRows(rows) {
    return [...rows].sort((a, b) => {
      const aOther = a.country?.toLowerCase?.() === 'other';
      const bOther = b.country?.toLowerCase?.() === 'other';
      if (aOther && !bOther) return 1;
      if (bOther && !aOther) return -1;
      return b.value - a.value;
    });
  }

  // Build [{ key, label, rows: [{country,value}] }]
  function materialsWithImports(el) {
    const out = [];
    for (const [key, mat] of Object.entries(el?.materials ?? {})) {
      const imports = mat?.imports || {};
      const rows = Object.entries(imports)
        .map(([country, pct]) => ({ country, value: toNum(pct) ?? 0 }))
        .filter((d) => d.value > 0);

      if (rows.length) {
        out.push({
          key,
          label: mat?.importNumbersFor || key,
          rows: sortRows(rows)
        });
      }
    }
    return out;
  }

  $: blocks = materialsWithImports(element);
  $: importNotes = element?.import_notes || '';
</script>

<div class="bars">
  <h3>Countries imported from</h3>
  {#if importNotes}
    <p class="importNotes">{@html importNotes}</p>
  {/if}

  {#if blocks.length === 0}
    <p class="empty">No import breakdown available.</p>
  {:else}
    {#each blocks as b (b.key)}
      <section class="material-block">
        <h4 class="mat-label">{b.label}</h4>

        {#each b.rows as r (`${b.key}::${r.country}`)}
          <div class="bar-row" transition:fade={{ duration: 180 }} animate:flip>
            <span class="label">{r.country}</span>
            <span class="value">{Math.round(r.value)}%</span>
            <div class="bar-track" aria-hidden="true">
              <div class="bar" style="width: {Math.min(r.value, 100)}%"></div>
            </div>
          </div>
        {/each}
      </section>
    {/each}
  {/if}
</div>

<style>
  .bars {
    padding: 0 1rem;
    font-size: 1.125rem;
    width: 100%;
  }

  .bars h3 {
    text-align: left;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }

  .material-block {
    margin: 1.25rem 0 1.75rem;
  }
  .mat-label {
    margin: 0 0 .5rem;
    font-size: 1.05rem;
    font-weight: 700;
  }

  .bar-row {
    display: grid;
    grid-template-columns: 180px 56px 1fr; /* wider label for long country names */
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .value { text-align: right; }

  .bar-track {
    height: 10px;
    background: #eee6d8;
    overflow: hidden;
  }
  .bar {
    height: 100%;
    background: #5a175d;
    transition: width 500ms ease;
  }

  .importNotes { font-size: 1rem; margin-bottom: .5rem; }
  .empty { opacity: .7; }
</style>
