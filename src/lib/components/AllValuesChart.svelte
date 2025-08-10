<script>
  import { onMount, onDestroy } from 'svelte';
  import Highcharts from 'highcharts';

  // PROPS
  // - elements: array of element rows (each with `materials` object like your per-element chart)
  // - element (optional): single element row if you want to show just one
  // - mode: 'all' (default) plots all elements; 'single' plots the passed `element`
  // - masterYears: default 2020–2024; override if needed
  export let elements = [];
  export let element = null;
  export let mode = 'all';
  export let masterYears = [2020, 2021, 2022, 2023, 2024];

  // INTERNAL STATE
  let wrapperEl;       // flex item wrapper
  let containerEl;     // chart container
  let chart;
  let ro;              // ResizeObserver

  // Derived
  let years = masterYears.map(String);  // x-axis categories (strings for HC)
  let series = [];                      // flat array of HC series

  // ---- Helpers --------------------------------------------------------------

  // Parse "90" or "90%" to number, return null for empties
  const toNum = (v) => {
    if (v == null || v === '') return null;
    const n = typeof v === 'string' ? parseFloat(v.replace('%', '')) : +v;
    return Number.isFinite(n) ? n : null;
  };

  // Build { years[], series[] } for a single element, using its `materials` object.
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
      return { name, data, type: 'line' };
    });

    return { years: localYears, series };
  }

  // Align a series' data (which currently has points with specific `year`s) to masterYears
  function alignToYears(s, master) {
    const byYear = new Map((s.data || []).map((p) => [String(p.year), p]));
    const aligned = master.map((yr) => {
      const p = byYear.get(String(yr));
      return p ? { ...p, year: yr } : { y: null, year: yr };
    });
    return { ...s, data: aligned, type: 'line' };
  }

  // Build a flat array of series across ALL elements/materials
  function buildAllSeries(rows, master) {
    const list = Array.isArray(rows) ? rows : Object.values(rows ?? {});
    const bundles = list.map(toSeries);                 // [{ years, series }, ...]
    const cats = master.map(String);
    const flat = bundles
      .flatMap((b) => b.series)
      .map((s) => alignToYears(s, master))
      .filter((s) => s.data.some((p) => p.y != null));
    return { years: cats, series: flat };
  }

  // Build for single element/materials
  function buildSingleSeries(row, master) {
    const built = toSeries(row);
    const cats = master.map(String);
    const flat = built.series
      .map((s) => alignToYears(s, master))
      .filter((s) => s.data.some((p) => p.y != null));
    return { years: cats, series: flat };
  }

  // ---- Reactive build of years/series --------------------------------------

  $: {
    const built =
      mode === 'single' && element
        ? buildSingleSeries(element, masterYears)
        : buildAllSeries(elements, masterYears);

    years = built.years;
    series = built.series;
  }

  // ---- Reactive chart sync --------------------------------------------------

  $: if (chart) {
    // Update categories
    chart.xAxis[0].setCategories(years, false);

    // Add/update series
    series.forEach((s, i) => {
      if (chart.series[i]) {
        chart.series[i].update({ name: s.name }, false);
        chart.series[i].setData(s.data, false);
      } else {
        chart.addSeries(s, false);
      }
    });

    // Remove any extra series
    while (chart.series.length > series.length) chart.series.at(-1).remove(false);
    chart.redraw();
  }

  $: console.log(series)
  // ---- Mount / destroy ------------------------------------------------------

  onMount(() => {
    chart = Highcharts.chart(containerEl, {
      chart: { type: 'line', backgroundColor: '#eee6d8', animation: true },
      title: { text: '' },
      credits: { enabled: false },
      legend: {
        enabled: false,            // helpful when plotting many lines
        maxHeight: 140,
        navigation: { enabled: true },
        itemStyle: { fontSize: '11px' }
      },
      xAxis: { categories: years},
      yAxis: { min: 0, max: 100, title: { text: '' }, gridLineColor: 'rgba(0,0,0,.08)' },
      plotOptions: {
        series: {
          pointPlacement: 'on',
          animation: { duration: 400 },
          lineWidth: 1.2,
          marker: { radius: 2, enabledThreshold: 12 },
          states: {
            inactive: { opacity: 0.15 } // hover one series = dim others
          },
          events: {
            mouseOver() {
              if (!chart) return;
              chart.series.forEach((s) => s !== this && s.setState('inactive'));
            },
            mouseOut() {
              if (!chart) return;
              chart.series.forEach((s) => s.setState());
            }
          }
        }
      },
      tooltip: {
        useHTML: true,
        formatter() {
          const p = this.point;
          return `<div>
            <b>${this.series.name}</b> — ${p.year}<br/>
            Net import reliance: <b>${p.y ?? '—'}%</b>
          </div>`;
        }
      },
      series // initial flat, aligned array
    });

    // Reflow on container resize
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
  <figure class="allvals-figure">
    <div class="allvals-chart" bind:this={containerEl}></div>
  </figure>
</section>

<style>
  /* .allvals-root { width: 100%; } */
  /* .allvals-figure { margin: 0; width: 100%; } */
  .allvals-chart { width: 100%; min-height: 560px; }

  /* Keep HC from clinging to an old inline width after layout shifts */
  :global(.highcharts-container) { width: 100% !important; }
</style>
