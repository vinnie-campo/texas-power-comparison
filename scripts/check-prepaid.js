const XLSX = require('xlsx');
const wb = XLSX.readFile('power-to-choose.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
data.slice(0, 10).forEach(d => {
  console.log(d['Plan Name'], '| Prepaid:', d.Prepaid, '| Rate Type:', d['Rate Type']);
});
