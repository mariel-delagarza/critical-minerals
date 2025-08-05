<!-- This is the periodic table itself -->
<script>
  // This component will render the periodic table
  import Element from '$lib/components/Element.svelte';
  export let data;
  let elements = [];

  console.log("Page data:", data); // <--- should be full array
</script>

<div class="periodic-grid">
  {#each data as element}
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
  }

  .cell {
    /* Optional: add spacing if needed */
  }
</style>