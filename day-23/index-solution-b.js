const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 11:42pm
// ended: 11:46pm

const prepareCoordsMap = (text) => {
	const coordsMap = {};
	text.split('\n').forEach((line, y) => {
		line.split('').forEach((char, x) => {
			if (char === '#') {
				coordsMap[`${x},${y}`] = {
					tryNext: 0,
					pos: `${x},${y}`,
					goto: null,
				};
			}
		});
	});
	return coordsMap;
};

const directions = {
	NW: [ -1, -1 ],
	N:  [  0 ,-1 ],
	NE: [  1, -1 ],
	E:  [  1,  0 ],
	SE: [  1,  1 ],
	S:  [  0,  1 ],
	SW: [ -1,  1 ],
	W:  [ -1,  0 ],
};

const getElfNeighbors = (coordsMap, elf) => {
	const splits = elf.split(',').map((n) => n * 1);
	const result = {};
	Object.entries(directions).forEach((entry) => {
		const [directionName, adder] = entry;
		const newX = splits[0] + adder[0];
		const newY = splits[1] + adder[1];
		const label = `${newX},${newY}`;
		if (coordsMap[label]) {
			result[directionName] = label;
		}
	});
	return result;
};

const moveCoords = (coords, direction) => {
	const splits = coords.split(',').map((n) => n * 1);
	const nu = [
		directions[direction][0] + splits[0],
		directions[direction][1] + splits[1],
	];
	return `${nu[0]},${nu[1]}`;
};

const tryDirs = {
	'N': [ 'N', 'NE', 'NW' ],
	'S': [ 'S', 'SE', 'SW' ],
	'W': [ 'W', 'NW', 'SW' ],
	'E': [ 'E', 'NE', 'SE' ],
};

const loopyDir = [ 'N', 'S', 'W', 'E' ];

const doRound = (coordsMap) => {
	const gotoMap = {};
	// first half
	const elfCoords = Object.keys(coordsMap);
	elfCoords.forEach((coord) => {
		const neighbors = getElfNeighbors(coordsMap, coord);
		const neighborCoords = Object.keys(neighbors);
		let tryNext = coordsMap[coord].tryNext;
		let goDir = null;
		if (!neighborCoords.length) {
			// no neighbors = they will not move
		} else {
			for (let i = 0; i < loopyDir.length; i++) {
				const thisTry = (tryNext + i) % 4;
				const tryDir = loopyDir[thisTry];
				const dir1 = tryDirs[tryDir][0];
				const dir2 = tryDirs[tryDir][1];
				const dir3 = tryDirs[tryDir][2];
				if (
					!neighbors[dir1]
					&& !neighbors[dir2]
					&& !neighbors[dir3]
				) {
					goDir = loopyDir[thisTry];
					break;
				}
			}
		}
		coordsMap[coord].tryNext = (coordsMap[coord].tryNext + 1) % 4;
		if (goDir) {
			const goto = moveCoords(coord, goDir)
			coordsMap[coord].goto = goto;
			gotoMap[goto] = (gotoMap[goto] || 0) + 1;
		}
	});
	// second half
	const newCoordsMap = {};
	elfCoords.forEach((coord) => {
		const goto = coordsMap[coord].goto
		if (goto && gotoMap[goto] === 1) {
			newCoordsMap[goto] = {
				tryNext: coordsMap[coord].tryNext,
				pos: goto,
				goto: null
			};
		} else {
			newCoordsMap[coord] = {
				tryNext: coordsMap[coord].tryNext,
				pos: coord,
				goto: null
			};
		}
	});
	return newCoordsMap;
};

const drawMap = (coordsMap) => {
	return me.drawUnanchoredCoords(Object.keys(coordsMap))
		.split('\n')
		.reverse()
		.join('\n');
};

const puzzle = (text) => {
	let coordsMap = prepareCoordsMap(text);
	let lastMap = drawMap(coordsMap);
	let thisMap = '';
	let round = 0;
	while (lastMap !== thisMap) {
		round += 1;
		coordsMap = doRound(coordsMap);
		lastMap = thisMap;
		thisMap = drawMap(coordsMap);
	}
	return round;
};

console.log(me.unitTestResults(
	'Sample input',
	20,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
