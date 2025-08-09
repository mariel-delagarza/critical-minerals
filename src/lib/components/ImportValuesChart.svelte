<script>
  import { onMount, onDestroy } from 'svelte';
  import Highcharts from 'highcharts';

  export let element;

  let containerEl;
  let chart;

  $: console.log(element)

  // Build categories + series from element.materials
  function toSeries(el) {
    if (!el?.materials) return { years: [], series: [] };

    // 1) Collect years (union across materials, then sort)
    const yearSet = new Set();
    for (const mat of Object.values(el.materials)) {
      Object.keys(mat || {}).forEach(k => { if (/^\d{4}$/.test(k)) yearSet.add(+k); });
    }
    const years = [...yearSet].sort((a, b) => a - b).map(String);

    // 2) One series per material
    const series = Object.entries(el.materials).map(([materialName, yearObj]) => {
      // Build points in the same year order; include extra props on each point
      const data = years.map(yr => {
        const rec = yearObj?.[yr];
        // y = value (or null for gaps)
        return rec
          ? { y: Number(rec.value) ?? null, year: +yr, ...rec }
          : { y: null, year: +yr }; // keep x position with a gap
      });
      return { name: materialName, data };
    });

    return { years, series };
  }

  // Recompute when element changes
  $: ({ years, series } = toSeries(element));

  // Push updates into the existing chart for smooth animation
  $: if (chart) {
    chart.xAxis[0].setCategories(years, false);
    // sync series count (add/remove) and data
    series.forEach((s, i) => {
      if (chart.series[i]) {
        chart.series[i].update({ name: s.name }, false);
        chart.series[i].setData(s.data, false); // animate from last values
      } else {
        chart.addSeries(s, false);
      }
    });
    while (chart.series.length > series.length) {
      chart.series[chart.series.length - 1].remove(false);
    }
    chart.redraw();
  }

  onMount(() => {
    chart = Highcharts.chart(containerEl, {
      chart: { type: 'line', backgroundColor: '#eee6d8', animation: true },
      title: { text: 'Net Import Reliance' },
      credits: { enabled: false },
      xAxis: { categories: years },
      yAxis: { min: 0, max: 100, title: { text: 'Percent' } },
      plotOptions: {
        series: { animation: { duration: 500 } },
        line: { marker: { enabled: true, radius: 3 } }
      },
      tooltip: {
        useHTML: true,
        formatter() {
          const p = this.point;
          // p has: y, year, value, netExporter, greaterThan, lessThan, ...
          const yesNo = v => (v ? 'Yes' : 'No');
          return `
            <div>
              <b>${this.series.name}</b> — ${p.year}<br/>
              Value: <b>${p.y}%</b><br/>
              Net exporter: ${yesNo(p.netExporter)}<br/>
              Greater than: ${yesNo(p.greaterThan)}<br/>
              Less than: ${yesNo(p.lessThan)}
            </div>`;
        }
      },
      series // initial
    });
  });

  onDestroy(() => chart?.destroy());
</script>

<figure class="highcharts-figure" style="margin:0">
  <div bind:this={containerEl} style="width:100%"></div>
</figure>
