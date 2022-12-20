const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// Based on the Rust version done with Rust-sempai 12/19/22
// (No peeking!)

const targetWorldHeight = 40;
const pieceSpacing = 3;
const pieceOffset = 2;
const targetRockCount = 2022;

const blankRow = 0b0000_0001;
const bottomRow = 0b1111_1111;

// piece coords: upper-left = 0,0
const horizPipe = [
	0b0000_0000,
	0b0000_0000,
	0b0000_0000,
	0b1111_0000,
];
const plus = [
	0b0000_0000,
	0b0100_0000,
	0b1110_0000,
	0b0100_0000,
];
const ell = [
	0b0000_0000,
	0b0010_0000,
	0b0010_0000,
	0b1110_0000,
];
const vertPipe = [
	0b1000_0000,
	0b1000_0000,
	0b1000_0000,
	0b1000_0000,
];
const square = [
	0b0000_0000,
	0b0000_0000,
	0b1100_0000,
	0b1100_0000,
];
const pieces = [
	horizPipe,
	plus,
	ell,
	vertPipe,
	square
];

const makeNewWorld = (maxWorldHeight) => {
	const world = [];
	for (let i = 0; i < maxWorldHeight - 1; i++) {
		world.push(blankRow);
	}
	world.push(bottomRow);
	return world;
};

const drawWorld = (world) => {
	let strings = [];
	world.forEach((line) => {
		let insert = '|';
		for (let i = 7; i > 0; i--) {
			const shifted = line >>> i;
			const bitwise = shifted & 0b0000_0001;
			insert += bitwise ? '#' : '.';
		}
		insert += '|';
		strings.push(insert);
	})
	return strings.join('\n');
};


const getWorldHeight = (world) => {
	const bottomUp = world.slice().reverse();
	for (let i = 0; i < bottomUp.length; i++) {
		if (bottomUp[i] === 1) {
			return i;
		}
	}
	return bottomUp.length - 1;
};

const scrollWorld = (world) => {
	const tilesHeight = getWorldHeight(world);
	let culled = 0;
	while (
		world.length > targetWorldHeight
		&& world[0] === 0
	) {
		world.shift();
	}
	if (tilesHeight > targetWorldHeight) {
		const cullBy = tilesHeight - targetWorldHeight;
		world.length = world.length - cullBy;
		culled += cullBy;
	}
	return culled;
};

const makeRoomForPieceAndGetY = (world, piece) => {
	const tilesHeight = getWorldHeight(world); // 1
	const roomNeeded = piece.length + pieceSpacing; // 4 + 3
	const heightNeeded = tilesHeight + roomNeeded
	while (world.length < heightNeeded) {
		world.unshift(blankRow);
	}
	const placePieceAtY = world.length - tilesHeight - roomNeeded;
	return placePieceAtY;
};

const canPieceFit = (world, piece, x, y) => {
	if (x < 0) { // off left edge
		return false;
	}
	for (let i = 0; i < piece.length; i++) {
		const worldY = i + y;
		const shiftedLine = piece[i] >>> x;
		const overlaps = shiftedLine & world[worldY];
		if (overlaps) {
			return false;
		}
	}
	return true;
};

const placePieceAt = (world, piece, x, y) => {
	for (let i = 0; i < piece.length; i++) {
		const worldY = i + y;
		const shiftedLine = piece[i] >>> x;
		world[worldY] = shiftedLine | world[worldY];
	}
};

const dirMap = {
	'drop': [0,-1],
	'<': [-1,0],
	'>': [1,0],
};

const windDo = {
	'<': -1,
	'>': 1,
}

const puzzle = (text) => {
	let world = makeNewWorld(targetWorldHeight);
	const winds = text.split('');
	let windIndex = 0;
	let scrolled = 0;
	for (let rockCount = 0; rockCount < targetRockCount; rockCount++) {
		const piece = pieces[rockCount % pieces.length];
		let y = makeRoomForPieceAndGetY(world, piece);
		let x = pieceOffset;
		let landed = false;
		while (!landed) {
			const wind = winds[windIndex % winds.length];
			windIndex += 1;
			// wind pass
			if (canPieceFit(world, piece, x + windDo[wind], y)) {
				x += windDo[wind];
			}
			// drop pass
			if (canPieceFit(world, piece, x, y + 1)) {
				y += 1;
				if (y > world.length) {
					throw new Error("A piece fell through the void!")
				}
			} else {
				placePieceAt(world, piece, x, y);
				landed = true;
			}
		}
		scrolled += scrollWorld(world);
	}
	return getWorldHeight(world) + scrolled - 1;
};

console.log(me.unitTestResults(
	'Sample input',
	3068,
	puzzle(sampleFileText)
));
console.log(me.unitTestResults(
	'Real input',
	3166,
	puzzle(fileText)
));
