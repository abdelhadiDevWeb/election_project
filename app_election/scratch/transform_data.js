const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:/Users/MY PC/Desktop/election_project/wilayas-with-municipalities.json', 'utf8'));

const wilayasData = data.map((w) => ({
  id: w.wilayaCode,
  name: w.nameFr,
  num_wilaya: w.wilayaCode.toString().padStart(2, '0'),
  seats_count: Math.floor(Math.random() * 20) + 8,
  communes: w.communes.length,
  centers: w.communes.length * 4,
  desks: w.communes.length * 20
}));

const communesData = [];
data.forEach((w) => {
  w.communes.forEach((c, index) => {
    communesData.push({
      id: communesData.length + 1,
      name: c.nameFr,
      num_bladia: (c.id || index + 1).toString().padStart(2, '0'),
      wilaya: w.nameFr,
      centers: 4,
      desks: 20
    });
  });
});

console.log('WILAYAS_DATA_START');
console.log(JSON.stringify(wilayasData));
console.log('WILAYAS_DATA_END');

console.log('COMMUNES_DATA_START');
console.log(JSON.stringify(communesData));
console.log('COMMUNES_DATA_END');
