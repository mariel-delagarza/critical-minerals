<!-- This will be a line chart comparing net import reliance over time -->
<script>
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts';

  export let element;

  $: console.log('ImportRelianceChart got element: ', element)

	onMount(() => {
		Highcharts.chart('reliance-container', {
			chart: {
				type: 'bar'
			},
			title: {
				text: 'Corn vs wheat estimated production for 2023'
			},
			subtitle: {
				text:
					'Source: <a target="_blank" ' +
					'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>'
			},
			xAxis: {
				categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
				crosshair: true,
				accessibility: {
					description: 'Countries'
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: '1000 metric tons (MT)'
				}
			},
			tooltip: {
				valueSuffix: ' (1000 MT)'
			},
			plotOptions: {
				column: {
					pointPadding: 0.2,
					borderWidth: 0
				}
			},
			series: [
				{
					name: 'Corn',
					data: [387749, 280000, 129000, 64300, 54000, 34300]
				},
				{
					name: 'Wheat',
					data: [45321, 140000, 10000, 140500, 19500, 113500]
				}
			]
		});
	});
</script>

<div id="import-reliance-chart">
	<strong>Import Reliance Chart</strong>

	<figure class="highcharts-figure">
		<div id="reliance-container"></div>
		<p class="highcharts-description">
			A basic column chart comparing estimated corn and wheat production in some countries. The
			chart is making use of the axis crosshair feature, to highlight the hovered country.
		</p>
	</figure>
</div>

<style>
	#import-reliance-chart {
		outline: 1px solid red;
	}
</style>
