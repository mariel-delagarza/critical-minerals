<!-- This component represents a single element in the periodic table -->
<script>
	export let element;
	export let activeFilter;

	const isDOI = element['2022_doi_list'];
	const isDOE = element.doe_critical_mineral;
	const isDLA = element.dla_materials_of_interest;

	$: listCount = [isDOI, isDOE, isDLA].filter(Boolean).length;

	$: classes = `element ${
		activeFilter === 'all'
			? listCount === 3
				? 'three-lists'
				: isDOI && isDOE
					? 'doi-doe'
					: isDOI && isDLA
						? 'doi-dla'
						: isDOE && isDLA
							? 'doe-dla'
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
</script>

<div class={classes}>
	<div class="number">{element.atomic_number}</div>
	<div class="symbol">{element.symbol}</div>
</div>

<style>
	/* --------------- Element, Number, Symbol -------------- */

	@property --doi {
		syntax: '<color>';
		initial-value: #edab12;
		inherits: false;
	}

	@property --doe {
		syntax: '<color>';
		initial-value: #0b1d51;
		inherits: false;
	}

	@property --dla {
		syntax: '<color>';
		initial-value: #6e1e43;
		inherits: false;
	}

	@property --doi_hover {
		syntax: '<color>';
		initial-value: #9d6d07;
		inherits: false;
	}

	@property --doe_hover {
		syntax: '<color>';
		initial-value: #91a0ba;
		inherits: false;
	}

	@property --dla_hover {
		syntax: '<color>';
		initial-value: #bc8fa1;
		inherits: false;
	}

	.element {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-size: 1.125em;
		/* width: 4.5rem;
		height: 4.5rem; */
    /* width: 100%;
    height: 100%; */
    width: 100%; 
    aspect-ratio: 1/1;
		text-align: center;
		background-color: white;
		transition: background-color 0.3s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
	}
	.number {
		font-size: 1rem;
		color: #000;
	}

	.doi .number {
		color: #000;
	}

	.doi:hover .number {
		color: #fff;
		transition: color 0.3s ease;
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
		color: #fff;
	}

	.symbol {
		font-weight: bold;
		font-size: 1.5rem;
	}

	/* -------------------- DOI, DOE, DLA ------------------- */

	.doi {
		background-color: var(--doi);
		color: #000;
	}

	.doi:hover {
		background-color: var(--doi_hover);
		color: #fff;
	}

	.doe {
		background-color: var(--doe);
		color: #fff;
	}

	.doe:hover {
		background-color: var(--doe_hover);
		color: #000;
	}

	.dla {
		background-color: var(--dla);
		color: #fff;
	}

	.dla:hover {
		background-color: var(--dla_hover);
		color: #000;
	}

	/* ------------------------- All ------------------------ */

	.doi-doe {
		background: linear-gradient(to bottom right, var(--doi) 50%, var(--doe) 50%);
		color: #fff;
		transition:
			--doi 0.3s,
			--doe 0.3s;
	}

	.doi-doe:hover {
		--doi: var(--doi_hover);
		--doe: var(--doe_hover);
	}

	.doi-dla {
		background: linear-gradient(to bottom right, var(--doi) 50%, var(--dla) 50%);
		color: #fff;
		transition:
			--doi 0.3s,
			--dla 0.3s;
	}

	.doi-dla:hover {
		--doi: var(--doi_hover);
		--dla: var(--dla_hover);
	}

	.doe-dla {
		background: linear-gradient(to bottom right, var(--doe) 50%, var(--dla) 50%);
		color: #fff;
		transition:
			--doe 0.3s,
			--dla 0.3s;
	}

	.doe-dla:hover {
		--doe: var(--doe_hover);
		--dla: var(--dla_hover);
	}

	.three-lists {
		background: linear-gradient(
			to bottom right,
			var(--doi) 33%,
			var(--doe) 33% 66%,
			var(--dla) 66%
		);
		color: #fff;
		transition:
			--doi 0.3s,
			--doe 0.3s,
			--dla 0.3s;
	}

	.three-lists:hover {
		--doi: var(--doi_hover);
		--doe: var(--doe_hover);
		--dla: var(--dla_hover);
	}

	@media (max-width: 1900px) {
		/* .element {
			width: 3rem;
			height: 3rem;
		} */

		.number {
			font-size: 0.8rem;
		}

		.symbol {
			font-size: 1.2rem;
		}
	}
	@media (max-width: 1500px) {
		/* .element {
			width: 3rem;
			height: 3rem;
		} */

		.number {
			font-size: 0.7rem;
		}

		.symbol {
			font-size: 1rem;
		}
	}
</style>
