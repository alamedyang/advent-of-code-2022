const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 29;

// started: 12:42pm
// ended: 12:48pm

const compareChars = (_a, _b) => {
	const a = _a.replace('S', 'a');
	const b = _b.replace('E', 'z');
	return b.charCodeAt(0) - a.charCodeAt(0);
}

const makeCoordsFlat = (coords) => {
	return coords.x + "," + coords.y;
};
const makeCoordsUnflat = (flat) => {
	const splits = flat.split(",");
	return {
		x: parseInt(splits[0]),
		y: parseInt(splits[1]),
	};
};

const getNeighborCoordsFromGrid = (coords, grid) => {
	const result = [
		{
			x: coords.x - 1,
			y: coords.y,
		},
		{
			x: coords.x,
			y: coords.y - 1,
		},
		{
			x: coords.x + 1,
			y: coords.y,
		},
		{
			x: coords.x,
			y: coords.y + 1,
		},
	];
	const height = grid.length;
	const width = grid[0].length;
	return result.filter((coords)=>{
		return coords.x >= 0
			&& coords.x < width
			&& coords.y >= 0
			&& coords.y < height
	});
};

const getCoordsWithValue = (value, grid) => {
	const result = [];
	grid.forEach((row, rowIndex) => {
		row.forEach((cell, colIndex) => {
			if (cell === value) {
				result.push({
					x: colIndex,
					y: rowIndex
				})
			}
		});
	});
	return result;
};

// FLAT PATHS

const makeFlatPathMap = (grid) => {
	const flatPathMap = {};
	grid.forEach((row, rowIndex) => {
		row.forEach((value, colIndex) => {
			const currValue = value
				.replace('S','a')
				.replace('E','z');
			const coords = {
				x:colIndex,
				y:rowIndex,
				value: currValue
			}
			const flatCoords = makeCoordsFlat(coords)
			const neighbors = getNeighborCoordsFromGrid(coords, grid);
			flatPathMap[flatCoords] = [];
			neighbors.forEach((neighbor) => {
				const neighborValue = grid[neighbor.y][neighbor.x]
					.replace('S','a')
					.replace('E','z');
				const diff = compareChars(currValue,neighborValue);
				if (-1 <= diff) {
					flatPathMap[flatCoords].push(makeCoordsFlat(neighbor));
				}
			})
		});
	});
	return flatPathMap;
}
const getValueFromFlatCoords = (flatCoords, grid) => {
	const coords = makeCoordsUnflat(flatCoords);
	return grid[coords.y][coords.x];
}

const puzzle = (text) => {
	const grid = text.split('\n').map((line)=>{
		return line.split('');
	});
	const startCoord = getCoordsWithValue('S', grid)[0];
	const endCoord = getCoordsWithValue('E', grid)[0];

	const stepPaths = makeFlatPathMap(grid);
	console.log(stepPaths);

	let currentScore = 0;
	const stepScores = {};
	const stepStartCoords = makeCoordsFlat(endCoord);
	let stepsToFill = { [stepStartCoords]: true };
	let stepsToFillNext = {};

	while (Object.keys(stepsToFill).length) {
		Object.keys(stepsToFill).forEach((step) => {
			stepScores[step] = currentScore;
			const neighbors = stepPaths[step];
			const emptyNeighbors = neighbors.filter((step)=>{
				return !stepScores[step];
			});
			emptyNeighbors.forEach((neighbor) => {
				stepsToFillNext[neighbor] = true;
			})
		})
		stepsToFill = stepsToFillNext;
		stepsToFillNext = {};
		currentScore += 1;
	}
	const thresholdScores = Object.entries(stepScores)
		.filter((item)=>{
			const flatCoord = item[0];
			const value = getValueFromFlatCoords(flatCoord, grid);
			return value === "a" || value === "S";
		})
		.map((item)=>item[1])
		.sort((a,b)=>{a-b});
	return thresholdScores[0];
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
