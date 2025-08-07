<!-- This component represents a single element in the periodic table -->
<script>
	export let element;
	export let highlight;
	export let activeFilter;

	const isDOI = element['2022_doi_list'];
	const isDOE = element.doe_critical_mineral;
	const isDLA = element.dla_materials_of_interest;

	$: listCount = [isDOI, isDOE, isDLA].filter(Boolean).length;

	$: multiClass =
		listCount === 3
			? 'three-lists'
			: listCount === 2
				? 'two-lists'
				: isDOI
					? 'doi'
					: isDOE
						? 'doe'
						: isDLA
							? 'dla'
							: '';

	$: classes = `element ${activeFilter === 'all' ? 'all-mode' : ''} ${
		activeFilter === 'all'
			? listCount === 3
				? 'three-lists'
				: listCount === 2
					? 'two-lists'
					: isDOI
						? 'doi'
						: isDOE
							? 'doe'
							: isDLA
								? 'dla'
								: ''
			: activeFilter === 'doi' && isDOI
				? 'doi'
				: activeFilter === 'doe' && isDOE
					? 'doe'
					: activeFilter === 'dla' && isDLA
						? 'dla'
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
	/* --------------- Element, Number, Symbol -------------- */
	.element {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1.125em;
		width: 5rem;
		height: 5rem;
		text-align: center;
		background-color: white;
		transition: background-color 0.3s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
	}
	.number {
		font-size: 1rem;
		color: #000;
	}

	.doi .number {
		color: black;
	}

	.doi:hover .number {
		color: white;
	}

	.doe .number,
	.dla .number {
		color: #fff;
	}
  
  .doe:hover .number,
  .dla:hover .number {
    color: #000;
    transition: color 0.3s ease;
  }

	.three-lists .number {
		color: white;
	}

	.symbol {
		font-weight: bold;
		font-size: 1.5rem;
	}

	/* -------------------- DOI, DOE, DLA ------------------- */

	.doi {
		background-color: #edab12;
		color: #000;
	}

	.doi:hover {
		background-color: #9d6d07;
		color: #fff;
	}

	.doe {
		background-color: #0b1d51;
		color: #fff;
	}

  .doe:hover {
    background-color: #91a0ba;
    color: #000;
    transition: background-color 0.3s ease;
  }

	.dla {
		background-color: #6e1e43;
		color: #fff;
	}

  .dla:hover {
    background-color: #bc8fa1;
    color: #000;
    transition: background-color 0.3s ease;
  }

	/* ------------------------- All ------------------------ */
	.all {
		background-color: #888;
		color: #fff;
	}

	.all-mode {
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
	}

	.all-mode.doi {
		background-color: #edab12;
	}

	.all-mode.doe {
		background-color: #0b1d51;
	}

	.all-mode.dla {
		background-color: #6e1e43;
	}

	.two-lists {
		background: linear-gradient(to bottom right, #edab12 50%, /* DOI */ #0b1d51 50% /* DOE */);
		color: #fff;
	}

	.three-lists {
		background: linear-gradient(
			to bottom right,
			#edab12 33%,
			/* DOI */ #0b1d51 33% 66%,
			/* DOE */ #6e1e43 66% /* DLA */
		);
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
