<script>
	import { onMount, onDestroy } from 'svelte';
	import Highcharts from 'highcharts';

	// PROPS
	export let elements = [];
	export let element = null;
	export let mode = 'all';
	export let masterYears = [2020, 2021, 2022, 2023, 2024];

	// Drive highlight from parent (e.g., table click)
	export let selectedSymbol = null; // e.g., "Li" — set to null to clear

	// INTERNAL
	let wrapperEl, containerEl, chart, ro;
	let years = masterYears.map(String);
	let series = [];

	// how the active line should look
	const ACTIVE_STYLE = {
		width: 1.5, // thicker line
		shadow: {
			// persistent glow
			color: 'rgba(255,255,255,0.85)', // bright halo against beige
			width: 1.5, // blur radius
			offsetX: 0,
			offsetY: 0,
			opacity: 0.85
		}
	};
	const INACTIVE_OPACITY = 0.28; // tweak to taste

	// Parse "90" / "90%" -> number
	const toNum = (v) => {
		if (v == null || v === '') return null;
		const n = typeof v === 'string' ? parseFloat(v.replace('%', '')) : +v;
		return Number.isFinite(n) ? n : null;
	};

	// Build per-element series (per material) + tag with element meta
	function toSeries(el) {
		if (!el?.materials) return { years: [], series: [] };

		const yearSet = new Set();
		for (const mat of Object.values(el.materials)) {
			Object.keys(mat || {}).forEach((k) => {
				if (/^\d{4}$/.test(k)) yearSet.add(+k);
			});
		}
		const localYears = [...yearSet].sort((a, b) => a - b).map(String);

		const series = Object.entries(el.materials).map(([name, yearObj]) => {
			const data = localYears.map((yr) => {
				const rec = yearObj?.[yr];
				const y = toNum(rec?.value);
				return y == null ? { y: null, year: +yr, ...rec } : { y, year: +yr, ...rec };
			});
			return {
				name,
				data,
				type: 'line',
				custom: { symbol: el.symbol ?? el.name, elementName: el.name ?? el.symbol }
			};
		});

		return { years: localYears, series };
	}

	// Align a series to master years
	function alignToYears(s, master) {
		const byYear = new Map((s.data || []).map((p) => [String(p.year), p]));
		const aligned = master.map((yr) => {
			const p = byYear.get(String(yr));
			return p ? { ...p, year: yr } : { y: null, year: yr };
		});
		return { ...s, data: aligned, type: 'line' };
	}

	function buildAllSeries(rows, master) {
		const list = Array.isArray(rows) ? rows : Object.values(rows ?? {});
		const bundles = list.map(toSeries);
		const cats = master.map(String);
		const flat = bundles
			.flatMap((b) => b.series)
			.map((s) => alignToYears(s, master))
			.filter((s) => s.data.some((p) => p.y != null));
		return { years: cats, series: flat };
	}

	function buildSingleSeries(row, master) {
		const built = toSeries(row);
		const cats = master.map(String);
		const flat = built.series
			.map((s) => alignToYears(s, master))
			.filter((s) => s.data.some((p) => p.y != null));
		return { years: cats, series: flat };
	}

	// Build data
	$: {
		const built =
			mode === 'single' && element
				? buildSingleSeries(element, masterYears)
				: buildAllSeries(elements, masterYears);
		years = built.years;
		series = built.series;
	}

	// Sync chart with data
	$: if (chart) {
		chart.xAxis[0].setCategories(years, false);
		series.forEach((s, i) => {
			if (chart.series[i]) {
				chart.series[i].update(
					{
						name: s.name,
						custom: s.custom,
						marker: { enabled: true, symbol: 'circle', radius: 4 }
					},
					false
				);
				chart.series[i].setData(s.data, false);
			} else {
				chart.addSeries(s, false);
			}
		});
		while (chart.series.length > series.length) chart.series.at(-1).remove(false);
		chart.redraw();
		// re-apply highlight after any data rebuild
		applyFocus(selectedSymbol);
	}

	// Highlight logic -----------------------------------------------------------
	function applyFocus(sym) {
		if (!chart) return;
		const hasTarget = !!sym;

		chart.series.forEach((s) => {
			if (s.userOptions && !s.userOptions._origColor) {
				s.userOptions._origColor = s.userOptions.color ?? s.color;
			}

			const isTarget = hasTarget && s.userOptions?.custom?.symbol === sym;

			s.update(
				isTarget
					? {
							color: s.userOptions._origColor,
							lineWidth: 5,
							zIndex: 5,
							enableMouseTracking: true, // ✅ only target lines track mouse
							marker: {
								enabled: true,
								symbol: 'circle',
								radius: 4,
								lineWidth: 1,
								enabledThreshold: 0
							}
						}
					: hasTarget
						? {
								color: '#808080',
								lineWidth: 1.1,
								zIndex: 1,
								enableMouseTracking: false, // ❌ ignore mouse
								marker: { enabled: false }
							}
						: {
								color: s.userOptions._origColor,
								lineWidth: 1.2,
								zIndex: 1,
								enableMouseTracking: false, // ❌ ignore mouse
								marker: { enabled: false }
							},
				false
			);
			s.setState(isTarget ? '' : hasTarget ? 'inactive' : '');
		});

		chart.redraw();
	}

	// React when parent changes selectedSymbol
	$: if (chart) applyFocus(selectedSymbol);

	// expose an imperative API (optional)
	export function focusElementBySymbol(sym) {
		applyFocus(sym);
	}
	export function clearFocus() {
		applyFocus(null);
	}

	// Mount
	onMount(() => {
		chart = Highcharts.chart(containerEl, {
			colors: ['#88248c', '#00b0b3', '#a12c64', '#142c73'],
			chart: { type: 'line', backgroundColor: '#eee6d8', animation: true },
			title: { text: '' },
			credits: { enabled: false },
			legend: {
				enabled: false,
				maxHeight: 140,
				navigation: { enabled: true },
				itemStyle: { fontSize: '11px' }
			},
			xAxis: {
				categories: years,
				minPadding: 0,
				maxPadding: 0
			},
			yAxis: {
				min: 0,
				max: 100,
				title: { text: '' },
				gridLineColor: 'rgba(0,0,0,.08)',
				maxPadding: 1,
				endOnTick: false
			},
			plotOptions: {
				series: {
					connectNulls: true,
					enableMouseTracking: true, // <— no hover
					pointPlacement: 'on',
					animation: { duration: 400 },
					lineWidth: 1.2,
					marker: { enabled: false },
					states: { inactive: { opacity: 0.3 }, hover: { enabled: false } }
				}
			},
			tooltip: {
				useHTML: true,
				formatter() {
					const hoveredYear = this.point?.year;
					const series = this.series;
					const data = series?.data ?? [];
					const color = series.color || '#000';

					let output = `<strong>${series.name}</strong><br/>`;
					for (const point of data) {
						if (point.y != null) {
							const line = `${point.year}: ${point.y}%`;
							if (point.year === hoveredYear) {
								output += `<span style="color: ${color}; font-weight: bold; font-size: 20px;">${line}</span><br/>`;
							} else {
								output += `${line}<br/>`;
							}
						}
					}
					return output;
				},
				style: {
					fontSize: '16px'
				}
			},
			series
		});

		ro = new ResizeObserver(() => chart?.reflow());
		ro.observe(wrapperEl);
		requestAnimationFrame(() => chart?.reflow());
	});

	onDestroy(() => {
		ro?.disconnect();
		chart?.destroy();
	});
</script>

<section class="allvals-root" bind:this={wrapperEl}>
	<h3>Net Import Reliance, 2020 - 2024</h3>
	<figure class="allvals-figure">
		<div class="allvals-chart" bind:this={containerEl}></div>
	</figure>
</section>

<style>
	.allvals-root {
		margin-top: 1.25rem;
	}
	.allvals-chart {
		width: 100%;
		min-height: 560px;
	}
	:global(.highcharts-container) {
		width: 100% !important;
	}
</style>
