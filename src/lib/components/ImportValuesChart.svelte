<script>
	import { onMount, onDestroy } from 'svelte';
	import Highcharts from 'highcharts';

	export let element;

	let wrapperEl; // the 2‑col wrapper
	let containerEl; // the chart div
	let chart;
	let ro; // ResizeObserver

	function toSeries(el) {
		if (!el?.materials) return { years: [], series: [] };
		const yearSet = new Set();
		for (const mat of Object.values(el.materials)) {
			Object.keys(mat || {}).forEach((k) => {
				if (/^\d{4}$/.test(k)) yearSet.add(+k);
			});
		}
		const years = [...yearSet].sort((a, b) => a - b).map(String);

		const series = Object.entries(el.materials).map(([name, yearObj]) => {
			const data = years.map((yr) => {
				const rec = yearObj?.[yr];
				return rec ? { y: +rec.value ?? null, year: +yr, ...rec } : { y: null, year: +yr };
			});
			return { name, data };
		});

		return { years, series };
	}

	$: ({ years, series } = toSeries(element));

	$: if (chart) {
		chart.xAxis[0].setCategories(years, false);
		series.forEach((s, i) => {
			if (chart.series[i]) {
				chart.series[i].update({ name: s.name }, false);
				chart.series[i].setData(s.data, false);
			} else chart.addSeries(s, false);
		});
		while (chart.series.length > series.length) chart.series.at(-1).remove(false);
		chart.redraw();
	}

	onMount(() => {
		chart = Highcharts.chart(containerEl, {
			chart: { type: 'line', backgroundColor: '#eee6d8', animation: true },
			legend: { enabled: false },
			title: { text: '' },
			credits: { enabled: false },
			xAxis: { categories: years },
			yAxis: { min: 0, max: 100, title: { text: '' }, visible: false },
			plotOptions: { series: { animation: { duration: 500 } }, line: { marker: { radius: 3 } } },
			tooltip: {
				useHTML: true,
				formatter() {
					const p = this.point;
					const yn = (v) => (v ? 'Yes' : 'No');
					return `<div><b>${this.series.name}</b> — ${p.year}<br/>
            Value: <b>${p.y}%</b><br/>Net exporter: ${yn(p.netExporter)}<br/>
            Greater than: ${yn(p.greaterThan)}<br/>Less than: ${yn(p.lessThan)}</div>`;
				}
			},
			series
		});

		// Observe the FLEX ITEM, not an inner grid:
		ro = new ResizeObserver(() => chart?.reflow());
		ro.observe(wrapperEl);

		// Nudge once after initial mount in case siblings render later
		requestAnimationFrame(() => chart?.reflow());
	});

	onDestroy(() => {
		ro?.disconnect();
		chart?.destroy();
	});
</script>

<!-- Two-column layout -->

<section class="nir-root" bind:this={wrapperEl}>
	<figure class="nir-figure">
		<div class="nir-chart" bind:this={containerEl}></div>
	</figure>
</section>

<style>
	.nir-root {
		width: 100%;
	} /* flex item fills its track */
	.nir-figure {
		margin: 0;
		width: 100%;
	}
	.nir-chart {
		width: 100%;
		min-height: 260px;
	}

	/* Belt-and-suspenders: keep HC from clinging to an old inline width */
	:global(.highcharts-container) {
		width: 100% !important;
	}
</style>
