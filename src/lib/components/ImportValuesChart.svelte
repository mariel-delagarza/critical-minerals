<script>
	import { onMount } from 'svelte';
	import Highcharts from 'highcharts';

	export let element;

	// $: console.log('ImportRelianceChart got element: ', element)

	// y-axis: country names
	let categories = [];
	// materials - 1 per series
	let series = [
		{
			name: '', // material name
			data: [] // material import numbers
		}
	];

	$: if (element?.materials) {
		// unique countries across all materials
		const countrySet = new Set();
		for (const [, materialData] of Object.entries(element.materials)) {
			if (materialData?.imports) {
				for (const country of Object.keys(materialData.imports)) {
					countrySet.add(country);
				}
			}
		}
		categories = Array.from(countrySet);

		// 2) Build series: one per material, aligned to categories
		series = Object.entries(element.materials).map(([materialName, materialData]) => {
			const imports = materialData.imports || {};
			const data = categories.map((country) =>
				// use 0 if missing; use null if you want gaps instead of zeros
				typeof imports[country] === 'number' ? imports[country] : 0
			);
			return { name: materialName, data };
		});

		console.log(categories);
		console.log(series);
	}

	// $: console.log(getActiveMaterial(element));
	onMount(() => {
		Highcharts.chart('reliance-container', {
			chart: {
				type: 'line',
				backgroundColor: '#eee6d8'
			},
			title: {
				text: 'Net Reliance on Imports'
			},
			plotOptions: {
				bar: {
					pointPadding: 0.2,
					borderWidth: 0,
					borderRadius: 0
				}
			},
			credits: {
				enabled: false
			},
			subtitle: {
				text: ''
			},
			xAxis: {
				categories: categories,
				crosshair: true,
				accessibility: {
					description: 'Countries'
				}
			},
			yAxis: {
				min: 0,
				title: {
					text: 'Percentage of Imports'
				},
			},
			tooltip: {},
			series: series
		});
	});
</script>

<div id="import-reliance-chart">

	<figure class="highcharts-figure">
		<div id="reliance-container"></div>
	</figure>
</div>

<style>
	#import-reliance-chart {
		outline: 1px solid red;
	}
</style>