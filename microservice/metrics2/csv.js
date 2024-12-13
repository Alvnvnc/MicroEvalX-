// Import library yang dibutuhkan
const fs = require('fs');
const { Parser } = require('json2csv');

// Fungsi untuk mengonversi JSON ke CSV dengan format khusus
function convertStructuredMetricsToCsvCustomFormat(inputFile, outputFile) {
  // Baca file JSON
  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      return;
    }

    try {
      // Parse JSON data
      const jsonData = JSON.parse(data);

      // Daftar metrik utama
      const mainMetrics = ["noo", "alcom", "arq", "sam", "sidc", "mi", "sgm", "cc"];

      // Buat objek untuk menyimpan nilai metrik utama di baris pertama
      let headerRow = {};

      // Menyiapkan array data untuk setiap baris setelah headerRow
      const csvDataArray = [headerRow];

      // Iterasi setiap item JSON untuk memisahkan metrik utama dan variabel lain
      jsonData.forEach((item, index) => {
        let variableRow = {};

        // Pilah antara metrik utama dan variabel lainnya
        Object.keys(item).forEach((key) => {
          if (mainMetrics.includes(key)) {
            // Isi headerRow dengan nilai metrik utama dalam format desimal koma
            headerRow[key] = typeof item[key] === 'number' && item[key] % 1 !== 0
              ? item[key].toString().replace('.', ',')
              : item[key];
          } else {
            // Format variabel dengan sufiks indeks
            variableRow[`${key}_${index + 1}`] = typeof item[key] === 'number' && item[key] % 1 !== 0
              ? item[key].toString().replace('.', ',')
              : item[key];
          }
        });

        // Tambahkan baris variabel ke array data
        csvDataArray.push(variableRow);
      });

      // Inisialisasi parser JSON ke CSV dengan header
      const json2csvParser = new Parser({ header: true });
      const csvData = json2csvParser.parse(csvDataArray);

      // Tulis data CSV ke file output
      fs.writeFile(outputFile, csvData, (err) => {
        if (err) {
          console.error("Error writing CSV file:", err);
          return;
        }
        console.log(`CSV file has been created successfully at ${outputFile}`);
      });
    } catch (error) {
      console.error("Error parsing JSON data:", error);
    }
  });
}

// Tentukan nama file input dan output
const inputFile = 'combined.json';
const outputFile = 'structured_metrics_analysis_custom.csv';

// Panggil fungsi untuk konversi
convertStructuredMetricsToCsvCustomFormat(inputFile, outputFile);
