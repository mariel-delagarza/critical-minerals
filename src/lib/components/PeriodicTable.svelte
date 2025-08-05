<script>
  import Element from '$lib/components/Element.svelte';
  export let dataArray;
  let elements = [];
</script>

<div class="periodic-grid">
  {#each dataArray as element}
    <div
      class="cell"
      style="grid-column: {element.xpos}; grid-row: {element.ypos};"
    >
      <Element {element} />
    </div>
  {/each}
</div>

<style>
  .periodic-grid {
    display: grid;
    grid-template-columns: repeat(18, auto);
    grid-template-rows: repeat(10, auto);
    gap: 0.25rem;
    padding: 1rem;
    outline: 1px solid blue;
  }
</style>