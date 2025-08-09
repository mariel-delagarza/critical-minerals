<script>
  import { fade } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  export let element;

function rowsFromElement(el) {
  if (!el?.materials) return [];
  const totals = new Map();
  for (const m of Object.values(el.materials)) {
    const imports = m?.imports || {};
    for (const [country, pct] of Object.entries(imports)) {
      totals.set(country, (totals.get(country) || 0) + (Number(pct) || 0));
    }
  }

  return [...totals.entries()]
    .map(([country, value]) => ({ country, value }))
    .sort((a, b) => {
      const aIsOther = a.country.toLowerCase() === "other";
      const bIsOther = b.country.toLowerCase() === "other";
      if (aIsOther && !bIsOther) return 1;   // a is "Other" → goes after b
      if (bIsOther && !aIsOther) return -1;  // b is "Other" → goes after a
      return b.value - a.value;              // otherwise sort by % descending
    });
}


  $: rows = rowsFromElement(element);
</script>

<div class="bars">
  <h3>Countries imported from</h3>

  {#each rows as r (r.country)}
    <div
      class="bar-row"
      transition:fade={{ duration: 180 }}   
      animate:flip                        
    >
      <span class="label">{r.country}</span>
      <span class="value">{Math.round(r.value)}%</span>
      <div class="bar-track" aria-hidden="true">
        <div class="bar" style="width: {Math.min(r.value, 100)}%"></div>
      </div>
    </div>
  {/each}
</div>

<style>
  .bars {
    min-height: 700px;
    padding: 0 1rem;
    font-size: 1.125rem;
  }
  
  .bar-row {
    display: grid;
    grid-template-columns: 140px 56px 1fr;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .bar-track { height: 20px; background: #EEE6D8; overflow: hidden; }
  .bar { height: 100%; background: #5a175d; transition: width 500ms ease; }
</style>
