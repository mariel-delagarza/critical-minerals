<!-- This component represents a single element in the periodic table -->
<script>
	export let element;
</script>

<div class="element">
	<div class="number">{element.atomic_number}</div>
	<div class="symbol">{element.symbol}</div>
</div>

<style>
	.element {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		width: 5rem;
		height: 5rem;
		border: 1px solid #ccc;
		text-align: center;
		background-color: white;
		box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
	}

	.number {
		font-size: 1rem;
		color: #666;
	}

	.symbol {
		font-weight: bold;
		font-size: 1.5rem;
	}

  @media (max-width: 1900px) {
    .element {
      width: 3rem;
      height: 3rem;
    }

    .number {
      font-size: 0.8rem;
    }

    .symbol {
      font-size: 1.2rem;
    }
  }
  @media (max-width: 1500px) {
    .element {
      width: 3rem;
      height: 3rem;
    }

    .number {
      font-size: 0.7rem;
    }

    .symbol {
      font-size: 1rem;
    }
  }

</style>
