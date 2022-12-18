const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 10:14pm
// ended: 11:32pm

const neighborTransforms = [
	[1,0,0],
	[-1,0,0],
	[0,1,0],
	[0,-1,0],
	[0,0,1],
	[0,0,-1],
]
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

const puzzle = (text) => {
	const coordsMap = {};
	text.split('\n').forEach((line)=>coordsMap[line] = '#');
	const rangeX = [ Infinity, -Infinity ];
	const rangeY = [ Infinity, -Infinity ];
	const rangeZ = [ Infinity, -Infinity ];
	Object.keys(coordsMap).forEach((coords)=>{
		const splits = coords.split(',').map((item)=>parseInt(item,10));
		rangeX[0] = Math.min(rangeX[0], splits[0]);
		rangeX[1] = Math.max(rangeX[1], splits[0]);
		rangeY[0] = Math.min(rangeY[0], splits[1]);
		rangeY[1] = Math.max(rangeY[1], splits[1]);
		rangeZ[0] = Math.min(rangeZ[0], splits[2]);
		rangeZ[1] = Math.max(rangeZ[1], splits[2]);
	});
	rangeX[0] = rangeX[0] - 1;
	rangeY[0] = rangeY[0] - 1;
	rangeZ[0] = rangeZ[0] - 1;
	rangeX[1] = rangeX[1] + 1;
	rangeY[1] = rangeY[1] + 1;
	rangeZ[1] = rangeZ[1] + 1;
	const countEmptySides = (testCoords, coordsMap) => {
		// transplanted
		let tally = 0;
		const neighbors = getNeighborCoordStrings(testCoords);
		neighbors.forEach((neighbor)=>{
			if (
				coordsMap[neighbor] === 'S'
				|| !isInRange(neighbor)
			) {
				tally += 1;
			}
		});
		return tally;
	};
	// FILL BUCKET!!! :D
	const isInRange = (coordString) => {
		const splits = coordString.split(',').map((item)=>parseInt(item,10));
		return splits[0] <= rangeX[1]
			&& splits[0] >= rangeX[0]
			&& splits[1] <= rangeY[1]
			&& splits[1] >= rangeY[0]
			&& splits[2] <= rangeZ[1]
			&& splits[2] >= rangeZ[0];
	};
	const fillBucketCoords = `${rangeX[0]},${rangeY[0]},${rangeZ[0]}`;
	let fillCells = [ fillBucketCoords ];
	let nextFillCells = {};
	while (fillCells.length) {
		fillCells.forEach((cell) => {
			const neighbors = getNeighborCoordStrings(cell)
				.filter(isInRange)
				.filter((neighbor)=>!coordsMap[neighbor]);
			neighbors.forEach((coords)=>nextFillCells[coords] = true);
			coordsMap[cell] = 'S';
		});
		fillCells = Object.keys(nextFillCells);
		nextFillCells = {};
	}

	// drawing
	for (let z = rangeZ[0]; z <= rangeZ[1]; z++) {
		// console.log('Drawing Z of ' + z);
		const lines = [];
		for (let y = rangeY[0]; y <= rangeY[1]; y++) {
			let line = '';
			for (let x = rangeX[0]; x <= rangeX[1]; x++) {
				let char = coordsMap[`${x},${y},${z}`];
				if (!char) {
					char = '.';
				}
				const neighbors = getNeighborCoordStrings(`${x},${y},${z}`)
					.filter((neighbor) => {
						return coordsMap[neighbor] === '#';
					})
				if (neighbors.length === 6) {
					char = me.styleText(char,'red')
				} else if (char === 'S') {
					char = me.styleText(char,'black')
				}
				line += char;
			}
			lines.push(line);
		}
		// console.log(lines.join('\n') + '\n');
	}
	const faces = Object.keys(coordsMap)
		.filter((string)=>coordsMap[string] === '#')
		.map((string)=>countEmptySides(string, coordsMap));
	return faces.reduce((prev, cur)=>prev+cur, 0);
};

console.log(me.unitTestResults(
	'Sample input',
	58,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText)); // 2556

// 2538 is wrong
