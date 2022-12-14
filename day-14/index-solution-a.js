const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 24;

// started: launch
// ended: 10:39pm

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

const doSand = (fauxGrid) => {
	let sandPos = '500,0';
	let finalPos;
	const depths = Object.keys(fauxGrid).map((string)=>{
		return makeCoordsUnflat(string)[1];
	})
	depths.sort((a,b)=>b-a);
	const voidDepth = depths[0];
	while (!finalPos) {
		if (makeCoordsUnflat(sandPos)[1] > voidDepth) {
			return false;
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
	let sandPos = doSand(fauxGrid);
	let sandTally = 0;
	while (sandPos) {
		fauxGrid[sandPos] = 'O';
		sandTally += 1;
		sandPos = doSand(fauxGrid);
	}
	return sandTally;
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
