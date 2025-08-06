<!-- This component represents a single element in the periodic table -->
<script>
	export let element;
	export let highlight;
	export let activeFilter;

	$: classes = `element ${
		activeFilter === 'doi' && element['2022_doi_list']
			? 'doi'
			: activeFilter === 'doe' && element.doe_critical_mineral
				? 'doe'
				: activeFilter === 'dla' && element.dla_materials_of_interest
					? 'dla'
					: activeFilter === 'all' &&
						  (element['2022_doi_list'] ||
								element.doe_critical_mineral ||
								element.dla_materials_of_interest)
						? 'all'
						: ''
	}`;

	$: console.log(
		`[${element.symbol}] filter: ${activeFilter}, highlight: ${highlight}, classes: ${classes}`
	);
</script>

<div class={classes}>
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
		text-align: center;
		background-color: white;
		transition: background-color 0.3s;
	}
	.number {
		font-size: 1rem;
		color: #666;
	}

	.symbol {
		font-weight: bold;
		font-size: 1.5rem;
	}

  .doi .number {
    color: black;
  }
	.doe .number,
	.dla .number,
	.all .number {
		color: white;
	}
	.doi {
		background-color: #edab12;
		color: #000;
	}

	.doe {
		background-color: #0b1d51;
		color: #fff;
	}

	.dla {
		background-color: #5a175d;
		color: #fff;
	}

	.all {
		background-color: #888;
		color: #fff;
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
