const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 93;

// started: 10:39pm
// ended: 10:54pm

const expandLines = (text) => {
	const lines = text.split('\n');
	const coords = {};
	lines.forEach((line)=>{
		const vertices = line.split(' -> ');
		let firstVert = makeCoordsUnflat(vertices.shift());
		coords[firstVert[0] + ',' + firstVert[1]] = '#';
		while (vertices.length) {
			const secondVert = makeCoordsUnflat(vertices.shift());
			coords[secondVert[0] + ',' + secondVert[1]] = '#';
			if (firstVert[0] !== secondVert[0]) {
				const biggerX = firstVert[0] > secondVert[0]
					? firstVert[0]
					: secondVert[0];
				const smallerX = firstVert[0] < secondVert[0]
					? firstVert[0]
					: secondVert[0];
				const y = firstVert[1];
				for (let i = smallerX; i < biggerX; i++) {
					coords[i + ',' + y] = '#';
				}
			}
			if (firstVert[1] !== secondVert[1]) {
				const x = firstVert[0];
				const biggerY = firstVert[1] > secondVert[1]
					? firstVert[1]
					: secondVert[1];
				const smallerY = firstVert[1] < secondVert[1]
					? firstVert[1]
					: secondVert[1];
				for (let i = smallerY; i < biggerY; i++) {
					coords[x + ',' + i] = '#';
				}
			}
			firstVert = secondVert;
		}
	})
	return coords;
};

const getGravityCoords = (string) => {
	const array = makeCoordsUnflat(string);
	return [
		`${array[0]},${array[1]+1}`,
		`${array[0]-1},${array[1]+1}`,
		`${array[0]+1},${array[1]+1}`,
	];
};

const makeCoordsUnflat = (string) => {
	return string.split(',')
		.map((number)=>parseInt(number,10))
};

const doSand = (fauxGrid, floorDepth) => {
	let sandPos = '500,0';
	let finalPos;
	while (!finalPos) {
		if (makeCoordsUnflat(sandPos)[1] >= floorDepth - 1) {
			return sandPos;
		}
		const fallPaths = getGravityCoords(sandPos);
		if (!fauxGrid[fallPaths[0]]) { // direct down
			sandPos = fallPaths[0];
		} else if (!fauxGrid[fallPaths[1]]) { // left down
			sandPos = fallPaths[1];
		} else if (!fauxGrid[fallPaths[2]]) { // right down
			sandPos = fallPaths[2];
		} else {
			finalPos = sandPos;
		}
	}
	return finalPos;
};

const puzzle = (text) => {
	const fauxGrid = expandLines(text);
	const depths = Object.keys(fauxGrid).map((string)=>{
		return makeCoordsUnflat(string)[1];
	})
	depths.sort((a,b)=>b-a);
	const floorDepth = depths[0] + 2;
	let sandPos = doSand(fauxGrid, floorDepth);
	let sandTally = 0;
	while (!fauxGrid['500,0']) {
		fauxGrid[sandPos] = 'O';
		sandTally += 1;
		sandPos = doSand(fauxGrid, floorDepth);
	}
	return sandTally;
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
