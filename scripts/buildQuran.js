//from Tanzil to src/data/quran.json

const fs = require('fs');
const path = require('path');

const input = path.join(__dirname, '..', 'quran-uthmani.txt');
const output = path.join(__dirname, '..', 'src', 'data', 'quran.json');

if (!fs.existsSync(input)) {
  console.error('did not find quran-uthmani.txt in the main folder');
  process.exit(1);
}

const lines = fs.readFileSync(input, 'utf8').split('\n');
const quran = {};

for (const raw of lines) {
  const line = raw.trim();
  //ignore the comments lines
  if (!line || line.startsWith('#')) continue;

  const parts = line.split('|');
  if (parts.length < 3) continue;

  const surah = parseInt(parts[0], 10);
  const ayah = parseInt(parts[1], 10);
  let text = parts.slice(2).join('|').trim();

  // removing basmalla from the begining
  if (surah !== 1 && ayah === 1 && text.startsWith('بِسْمِ')) {
    text = text.split(' ').slice(4).join(' ');
  }

  if (!quran[surah]) quran[surah] = [];
  quran[surah][ayah - 1] = text;
}

fs.writeFileSync(output, JSON.stringify(quran));
console.log('تم! عدد السور:', Object.keys(quran).length);
