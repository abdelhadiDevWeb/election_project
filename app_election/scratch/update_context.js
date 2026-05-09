const fs = require('fs');
const path = require('path');

const jsonPath = 'c:/Users/MY PC/Desktop/election_project/wilayas-with-municipalities.json';
const contextPath = 'c:/Users/MY PC/Desktop/election_project/app_election/app/context/DataContext.tsx';

const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const wilayasData = jsonData.map((w) => ({
  id: w.wilayaCode,
  name: w.nameFr,
  num_wilaya: w.wilayaCode.toString().padStart(2, '0'),
  seats_count: Math.floor(Math.random() * 20) + 8,
  communes: w.communes.length,
  centers: w.communes.length * 4,
  desks: w.communes.length * 20
}));

const communesData = [];
jsonData.forEach((w) => {
  w.communes.forEach((c, idx) => {
    communesData.push({
      id: communesData.length + 1,
      name: c.nameFr,
      num_bladia: (c.id || idx + 1).toString().padStart(2, '0'),
      wilaya: w.nameFr,
      centers: 4,
      desks: 20
    });
  });
});

let contextContent = fs.readFileSync(contextPath, 'utf8');

// Find and replace wilayasData state
const wilayaStartMarker = 'const [wilayasData, setWilayasData] = useState([';
const wilayaEndMarker = ']);';

const wilayaStartIndex = contextContent.indexOf(wilayaStartMarker);
// We need to find the matching ']);' for THIS state
// A simple way is to find the NEXT ']);' after wilayaStartIndex
const wilayaEndIndex = contextContent.indexOf(wilayaEndMarker, wilayaStartIndex) + 2;

const newWilayaState = `const [wilayasData, setWilayasData] = useState(${JSON.stringify(wilayasData, null, 2)});`;

contextContent = contextContent.slice(0, wilayaStartIndex) + newWilayaState + contextContent.slice(wilayaEndIndex);

// Find and replace communesData state
const communeStartMarker = 'const [communesData, setCommunesData] = useState([';
const communeStartIndex = contextContent.indexOf(communeStartMarker);
const communeEndIndex = contextContent.indexOf(wilayaEndMarker, communeStartIndex) + 2;

const newCommuneState = `const [communesData, setCommunesData] = useState(${JSON.stringify(communesData, null, 2)});`;

contextContent = contextContent.slice(0, communeStartIndex) + newCommuneState + contextContent.slice(communeEndIndex);

fs.writeFileSync(contextPath, contextContent);
console.log('Successfully updated DataContext.tsx with all Wilayas and Communes.');
