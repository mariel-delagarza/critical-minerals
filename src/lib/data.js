import * as d3 from 'd3';

const sheetUrl =
	'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-tMtWQ4WECLecb4dsPLqxuwg-tb7_Zn38BAd85Jgxm4F8mfpkZSu5BByDwmGo-dK7DYiJITP7z9A6/pub?gid=2100537501&single=true&output=csv';

const COUNTRY_KEYS = [
	'Australia',
	'Austria',
	'Bahrain',
	'Belgium',
	'Bolivia',
	'Brazil',
	'Canada',
	'Chile',
	'China',
	'Czechia',
	'Finland',
	'France',
	'Gabon',
	'Germany',
	'India',
	'Indonesia',
	'Israel',
	'Italy',
	'Japan',
	'Kazakhstan',
	'Latvia',
	'Madagascar',
	'Malaysia',
	'Mexico',
	'Mozambique',
	'Morocco',
	'Norway',
	'Peru',
	'Philippines',
	'Poland',
	'Republic of Korea',
	'Russia',
	'Saudi Arabia',
	'Senegal',
	'South Africa',
	'United Arab Emirates',
	'United Kingdom',
	'Turkey',
	'Vietnam',
	'Other'
];

export async function getData() {
	const data = await d3.csv(sheetUrl);

	const structured = data.map((row) => {
		const isTrue = (val) => val?.toUpperCase() === 'TRUE';

		// Helper to turn a "25; true; null; false" string into a year object
		const parseYearData = (yearStr) => {
			if (!yearStr) return null;
			const [value, netExporter, greaterThan, lessThan] = yearStr
				.split(';')
				.map((v) => v.trim().toLowerCase() || null);

			return {
				value: value && !isNaN(value) ? +value : null,
				netExporter: netExporter === 'true',
				greaterThan: greaterThan === 'true',
				lessThan: lessThan === 'true'
			};
		};

		// Object to hold all material/year data
		let materials = {};

		// Loop over all possible material columns
		for (let i = 1; i <= 5; i++) {
			// adjust 5 if you might have more
			const labelCol = row[`net_import_reliance_percentage_of${i}_label`];
			if (!labelCol) continue; // skip if no label in this slot

			let materialName = labelCol.trim();
			materials[materialName] = {};

			// Loop over years 2020–2024 (adjust as needed)
			for (let year = 2020; year <= 2024; year++) {
				const yearCol = row[`${year}_${i}`]; // e.g. "2020_1", "2020_2"
				const parsed = parseYearData(yearCol);
				if (parsed) {
					materials[materialName][year] = parsed;
				}
			}

			materials[materialName]['applications'] = row[`applications_${i}`];
			materials[materialName][`importNumbersFor`] = row[`import_numbers_for_${i}`];
			materials[materialName][`primaryImportSource`] = row[`primary_import_source_${i}`];

			// Build imports object for this material from country columns
			const imports = {};
			COUNTRY_KEYS.forEach((country) => {
				const raw = row[country];
				if (!raw) return; // no data in this country column

				// split and pick the value for this material (i is 1-based)
				const parts = raw.split(';').map((s) => s.trim());
				const valStr = parts[i - 1]; // may be undefined if not provided
				if (valStr == null || valStr === '') return;

				const num = Number(valStr);
				if (!Number.isNaN(num)) {
					imports[country] = num; // store the % (or whatever unit your sheet uses)
				}
			});

			// only attach if we actually found any country values
			if (Object.keys(imports).length) {
				materials[materialName].imports = imports;
			}
		}

		// Build element object
		const element = {
			atomic_number: +row.atomic_number,
			symbol: row.symbol,
			name: row.name,
			xpos: +row.xpos,
			ypos: +row.ypos,
			series: row.series,
			rare_earth: isTrue(row.rare_earth) ? true : null,
			doe_critical_mineral: isTrue(row.doe_critical_mineral),
			'2022_doi_list': isTrue(row['2022_doi_list']),
			dla_materials_of_interest: isTrue(row.dla_materials_of_interest),
			notes: row.notes || null,
			materials // ✅ dynamic object of all materials + years
		};

		return element;
	});

	console.log(structured);
	return structured;
}
