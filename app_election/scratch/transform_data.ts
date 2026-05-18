import fs from 'fs';

const data = JSON.parse(fs.readFileSync('c:/Users/MY PC/Desktop/election_project/wilayas-with-municipalities.json', 'utf8'));

const wilayasData = data.map((w: any) => ({
  id: w.wilayaCode,
  name: w.nameFr,
  num_wilaya: w.wilayaCode.toString().padStart(2, '0'),
  seats_count: Math.floor(Math.random() * 20) + 5, // Random seats between 5 and 25
  communes: w.communes.length,
  centers: w.communes.length * 5, // Mock data
  desks: w.communes.length * 25   // Mock data
}));

const communesData: any[] = [];
data.forEach((w: any) => {
  w.communes.forEach((c: any) => {
    communesData.push({
      id: communesData.length + 1,
      name: c.nameFr,
      num_bladia: c.id.toString().padStart(2, '0'),
      wilaya: w.nameFr,
      centers: 5, // Mock data
      desks: 25   // Mock data
    });
  });
});

console.log('WILAYAS_DATA_START');
console.log(JSON.stringify(wilayasData, null, 2));
console.log('WILAYAS_DATA_END');

console.log('COMMUNES_DATA_START');
console.log(JSON.stringify(communesData, null, 2));
console.log('COMMUNES_DATA_END');
