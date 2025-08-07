import * as d3 from 'd3';

const sheetUrl =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT-tMtWQ4WECLecb4dsPLqxuwg-tb7_Zn38BAd85Jgxm4F8mfpkZSu5BByDwmGo-dK7DYiJITP7z9A6/pub?gid=0&single=true&output=csv';

export async function getData() {
  const data = await d3.csv(sheetUrl);

  const structured = data.map((row) => {
    const isTrue = (val) => val?.toUpperCase() === 'TRUE';

    const element = {
      atomic_number: +row.atomic_number,
      symbol: row.symbol,
      name: row.name,
      xpos: +row.xpos,
      ypos: +row.ypos,
      series: row.series,
      important_element:
        isTrue(row.usgs_critical_mineral) ||
        isTrue(row.doe_critical_mineral) ||
        isTrue(row.dla_materials_of_interest) ||
        isTrue(row.elements_associated_with_critical_minerals),
      rare_earth: isTrue(row.rare_earth) ? true : null,
      dla_materials_of_interest: isTrue(row.dla_materials_of_interest),
      doe_critical_mineral: isTrue(row.doe_critical_mineral),
      '2022_doi_list': isTrue(row['2022_doi_list']),
      elements_associated_with_critical_minerals: isTrue(row.elements_associated_with_critical_minerals),
      netExporter: isTrue(row.netExporter),
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
        netExporter: isTrue(row[`net_import_reliance_${year}_netExporter`]) ? true : null,
        isEstimate: isTrue(row[`net_import_reliance_${year}_isEstimate`]) ? true : null,
        greaterThan: isTrue(row[`net_import_reliance_${year}_greaterThan`]) ? true : null,
        lessThan: isTrue(row[`net_import_reliance_${year}_lessThan`]) ? true : null
      });
    }

    return element;
  });

  console.log(structured);
  return structured;
}
