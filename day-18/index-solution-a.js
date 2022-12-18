const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch
// ended: 10:14pm

const neighborTransforms = [
	[1,0,0],
	[-1,0,0],
	[0,1,0],
	[0,-1,0],
	[0,0,1],
	[0,0,-1],
];
const getNeighborCoordStrings = (testCoords) => {
	const splits = testCoords.split(',').map((item)=>parseInt(item,10));
	return neighborTransforms.map((transform)=>{
		return [
			transform[0] + splits[0],
			transform[1] + splits[1],
			transform[2] + splits[2],
		];
	}).map((coords)=>`${coords[0]},${coords[1]},${coords[2]}`);
};

const countEmptySides = (testCoords, coordsMap) => {
	let tally = 0;
	const neighbors = getNeighborCoordStrings(testCoords);
	neighbors.forEach((neighbor)=>{
		if (!coordsMap[neighbor]) {
			tally += 1;
		}
	});
	return tally;
};

const puzzle = (text) => {
	const coordsMap = {};
	text.split('\n').forEach((line)=>coordsMap[line] = true);
	const faces = text.split('\n').map((string)=>countEmptySides(string, coordsMap));
	return faces.reduce((prev, cur)=>prev+cur, 0);
};

console.log(me.unitTestResults(
	'Sample input',
	64,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
