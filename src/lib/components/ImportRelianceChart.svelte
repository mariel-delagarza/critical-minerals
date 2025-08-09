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
      // put "Other" last
      if (a.country.toLowerCase() === "other") return 1;
      if (b.country.toLowerCase() === "other") return -1;
      // otherwise sort alphabetically
      return a.country.localeCompare(b.country, undefined, { sensitivity: "base" });
    })
    .slice(0, 8); // optional: limit to top N
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
  .bar-row {
    display: grid;
    grid-template-columns: 140px 56px 1fr;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }
  .bar-track { height: 10px; background: #e5e7eb; overflow: hidden; }
  .bar { height: 100%; background: #60a5fa; transition: width 500ms ease; }
</style>
