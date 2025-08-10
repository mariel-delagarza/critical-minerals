<!-- This component represents a single element in the periodic table -->
<script>
	export let element;
	export let activeFilter;
	export let nirBins = []; // e.g. ['b26_75'] or ['b26_75','b76_99']

	const isDOI = element['2022_doi_list'];
	const isDOE = element.doe_critical_mineral;
	const isDLA = element.dla_materials_of_interest;
	let bins;


	$: listCount = [isDOI, isDOE, isDLA].filter(Boolean).length;

	// bin logic — pick a bin class or default
	$: {
		let next = '';
		if (activeFilter === 'nir') {
			const arr = Array.isArray(nirBins) ? nirBins : [];
			if (arr.includes('b0_25')) next = 'b0_25';
			else if (arr.includes('b26_75')) next = 'b26_75';
			else if (arr.includes('b76_99')) next = 'b76_99';
			else if (arr.includes('b100')) next = 'b100';
			else next = 'bNA';
		}
		bins = next;
		console.log(element.name, bins);
	}

	$: classes =
		activeFilter === 'nir'
			? `element ${bins}`
			: `element ${
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
  const BIN_COLORS = {
    b0_25:'#b2dfee', b26_75:'#6fbfd5', b76_99:'#2e8da5', b100:'#074e67', bNA:'#fff'
  };
  const ORDER = ['b0_25','b26_75','b76_99','b100','bNA']; // sort so it’s predictable

  let binsArr = [];   // <-- ALL bins for this element
  let nirStyle = '';  // inline background

  // Collect ALL bins (dedup + sorted) when NIR is active
  $: {
    if (activeFilter === 'nir') {
      const arr = Array.isArray(nirBins) ? nirBins.filter(Boolean) : [];
      const uniq = Array.from(new Set(arr));
      binsArr = uniq.length ? uniq.sort((a,b)=>ORDER.indexOf(a)-ORDER.indexOf(b)) : ['bNA'];
    } else {
      binsArr = [];
    }
    console.log(element.name, 'binsArr:', binsArr);
  }

  // Build gradient from binsArr (1 = solid, 2 = 50/50, 3+ = equal segments)
  $: {
    if (activeFilter !== 'nir') { nirStyle = ''; }
    else {
      const cs = binsArr.map(b => BIN_COLORS[b] || BIN_COLORS.bNA);
      if (cs.length <= 1) {
        nirStyle = `background:${cs[0] || BIN_COLORS.bNA};`;
      } else if (cs.length === 2) {
        nirStyle = `background:linear-gradient(135deg, ${cs[0]} 0 50%, ${cs[1]} 50% 100%);`;
      } else {
        const stops = cs.map((c,i,arr)=>{
          const s = Math.round((i/arr.length)*100);
          const e = Math.round(((i+1)/arr.length)*100);
          return `${c} ${s}% ${e}%`;
        }).join(', ');
        nirStyle = `background:linear-gradient(135deg, ${stops});`;
      }
    }
  }

  // Optional: flip text to white if any dark bin present
  $: lightText = activeFilter === 'nir' && binsArr.some(b => b==='b76_99' || b==='b100');
</script>

<div class={classes} style={nirStyle}>
  <div class="number" style={lightText ? 'color:#fff' : ''}>{element.atomic_number}</div>
  <div class="symbol" style={lightText ? 'color:#fff' : ''}>{element.symbol}</div>
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
		font-size: clamp(0.9rem, calc(var(--cell) * 0.28), 1.125rem);
		width: 100%;
		aspect-ratio: 1/1;
		text-align: center;
		background-color: white;
		transition: background-color 0.3s;
		box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
	}
	.number {
		font-size: clamp(0.7rem, calc(var(--cell) * 0.2), 1rem);
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
		font-size: clamp(1rem, calc(var(--cell) * 0.58), 1.5rem);
	}

	/* Bins*/

	.b0_25 {
		background-color: #e8f5e9;
	}

	.b26_75 {
		background-color: #c8e6c9;
	}

	.b76_99 {
		background-color: #81c784;
	}
	.b100 {
		background-color: #388e3c;
	}
	.bNA {
		background-color: #f3f4f6;
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
