const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch
// ended: 11:14pm

const horizPipe = [
	[ '.','.','@','@','@','@','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
];
const plus = [
	[ '.','.','.','@','.','.','.' ],
	[ '.','.','@','@','@','.','.' ],
	[ '.','.','.','@','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
];
const ell = [
	[ '.','.','.','.','@','.','.' ],
	[ '.','.','.','.','@','.','.' ],
	[ '.','.','@','@','@','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
];
const vertPipe = [
	[ '.','.','@','.','.','.','.' ],
	[ '.','.','@','.','.','.','.' ],
	[ '.','.','@','.','.','.','.' ],
	[ '.','.','@','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
];
const square = [
	[ '.','.','@','@','.','.','.' ],
	[ '.','.','@','@','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
	[ '.','.','.','.','.','.','.' ],
];
const pieces = [
	horizPipe,
	plus,
	ell,
	vertPipe,
	square
].map((shape)=>shape.reverse());

const findCoordsOfAts = (grid) => {
	const coords = [];
	for (let rowIndex = 0; rowIndex < grid.length; rowIndex++) {
		for (let colIndex = 0; colIndex < grid[0].length; colIndex++) {
			if (grid[rowIndex][colIndex] === '@') {
				coords.push([colIndex,rowIndex]);
			}
		}
	}
	return coords;
};

const dirMap = {
	'drop': [0,-1],
	'<': [-1,0],
	'>': [1,0],
};
const projectSingleCoords = (coords, dirString) => {
	const adders = dirMap[dirString];
	return [
		coords[0] + adders[0],
		coords[1] + adders[1],
	]
};
const projectCoords = (grid, dirString) => {
	const pieceCoords = findCoordsOfAts(grid);
	return pieceCoords.map((coords) => {
		return projectSingleCoords(coords, dirString);
	});
}

const giveWorldHaircut = (inputGrid) => {
	const grid = JSON.parse(JSON.stringify(inputGrid));
	while (
		grid[grid.length - 1].join('') === '.......'
	) {
		grid.pop();
	}
	return grid;
};


const puzzle = (text) => {
	let world = [];
	const winds = text.split('');
	const addPiece = (piece) => {
		world = world.concat(piece);
	};
	let windTally = 0;
	for (let rockCount = 0; rockCount < 2022; rockCount++) {
		const nextRock = JSON.parse(JSON.stringify(pieces[rockCount % pieces.length]));
		addPiece(nextRock);
		while (true) {
			const nextWind = winds[windTally % winds.length];
			windTally += 1;
			let currCoords = findCoordsOfAts(world);
			// wind pass
			let projectedCoords = projectCoords(world, nextWind);
			let invalidProjectedCoords = projectedCoords.filter((coords) => {
				return coords[0] <= -1
					|| coords[0] >= 7
					|| world[coords[1]][coords[0]] === '#';
			})
			if (!invalidProjectedCoords.length) {
				currCoords.forEach((coords) => {
					world[coords[1]][coords[0]] = '.';
				})
				projectedCoords.forEach((coords) => {
					world[coords[1]][coords[0]] = '@';
				})
				currCoords = projectedCoords.slice();
			}
			// down pass
			projectedCoords = projectCoords(world, 'drop');
			invalidProjectedCoords = projectedCoords.filter((coords) => {
				return coords[1] < 0
					|| world[coords[1]][coords[0]] === '#';
			})
			if (!invalidProjectedCoords.length) {
				currCoords.forEach((coords) => {
					world[coords[1]][coords[0]] = '.';
				})
				projectedCoords.forEach((coords) => {
					world[coords[1]][coords[0]] = '@';
				})
			} else {
				currCoords.forEach((coords) => {
					world[coords[1]][coords[0]] = '#';
				})
				break;
			}
		}
		world = giveWorldHaircut(world);
	}
	return world.length;
};

console.log(me.unitTestResults(
	'Sample input',
	1514285714288,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
