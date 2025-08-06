import * as d3 from 'd3';

const sheetUrl =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-tMtWQ4WECLecb4dsPLqxuwg-tb7_Zn38BAd85Jgxm4F8mfpkZSu5BByDwmGo-dK7DYiJITP7z9A6/pub?gid=0&single=true&output=csv';

export async function getData() {
	const data = await d3.csv(sheetUrl);

	const structured = data.map((row) => {
		const element = {
			atomic_number: +row.atomic_number,
			symbol: row.symbol,
			name: row.name,
			xpos: +row.xpos,
			ypos: +row.ypos,
			series: row.series,
			important_element:
				row.usgs_critical_mineral === '1' ||
				row.doe_critical_mineral === '1' ||
        row.dla_materials_of_interest === '1' ||
				row.elements_associated_with_critical_minerals === '1',
			rare_earth: row.rare_earth === '1' ? true : null,
		  dla_materials_of_interest: row.dla_materials_of_interest === '1',
			doe_critical_mineral: row.doe_critical_mineral === '1',
			'2022_doi_list': row['2022_doi_list'] === '1',
			elements_associated_with_critical_minerals:
				row.elements_associated_with_critical_minerals === '1',
			netExporter: row.netExporter === '1',
			commodity_type: row.commodity_type || null,
			notes: row.notes || null,
			imports_key: row.imports_key ? row.imports_key.split(';').map((d) => d.trim()) : null,
			primary_import_source: row.primary_import_source || null,
			major_import_source: null, // you'll probably parse this later
			applications: row.applications || null,
			net_import_reliance: []
		};

		for (let year = 2020; year <= 2024; year++) {
			const value = row[`net_import_reliance_${year}_value`];
			if (!value) continue;
			element.net_import_reliance.push({
				year,
				value: isNaN(value) ? value : +value,
				netExporter: row[`net_import_reliance_${year}_netExporter`] === '1' ? true : null,
				isEstimate: row[`net_import_reliance_${year}_isEstimate`] === '1' ? true : null,
				greaterThan: row[`net_import_reliance_${year}_greaterThan`] === '1' ? true : null,
				lessThan: row[`net_import_reliance_${year}_lessThan`] === '1' ? true : null
			});
		}
		return element;
	});

	console.log(structured);
  return structured;
}
