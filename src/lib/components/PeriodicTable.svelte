<script>
	import Element from '$lib/components/Element.svelte';
	export let dataArray;
	let elements = [];
</script>

<div class="table-wrapper">
	<div class="periodic-grid">
		{#each dataArray as element}
			<div class="cell" style="grid-column: {element.xpos}; grid-row: {element.ypos};">
				<Element {element} />
			</div>
		{/each}
	</div>
</div>

<style>
	.periodic-grid {
		display: grid;
		grid-template-columns: repeat(18, minmax(0, 1fr));
		grid-template-rows: repeat(10, auto);
		gap: 0.25rem;
		padding: 1rem;
		outline: 1px solid blue;
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
