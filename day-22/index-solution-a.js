const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

// started: launch
// ended: 

const makeMapMaps = (mapString) => {
	const mapMap = {};
	const wrapMap = {};
	const tempUD = {};
	let start;
	mapString.split('\n').forEach((line, y) => {
		const rowIndex = y + 1;
		let firstX;
		let lastX;
		line.split('').forEach((char, x) => {
			const colIndex = x + 1;
			if (char === ' ') {
				// do nothing
			} else {
				const label = `${colIndex},${rowIndex}`;
				if (!start) {
					start = label;
				}
				// map the char for the value of it
				mapMap[label] = char;
				// detect LR edges for wrapMap
				if (!firstX) {
					firstX = colIndex;
				}
				lastX = colIndex;
				// detect UD edges for wrapMap ??
				if (!tempUD[colIndex]) {
					tempUD[colIndex] = {
						top: rowIndex,
						bot: null,
					};
				}
				tempUD[colIndex].bot = rowIndex;
			}
		})
		wrapMap[`${firstX},${rowIndex}-left`] = `${lastX},${rowIndex}`;
		wrapMap[`${lastX},${rowIndex}-right`] = `${firstX},${rowIndex}`;
	});
	Object.entries(tempUD).forEach((tuple) => {
		const col = tuple[0];
		const firstY = tuple[1].top;
		const lastY = tuple[1].bot;
		wrapMap[`${col},${firstY}-up`] = `${col},${lastY}`;
		wrapMap[`${col},${lastY}-down`] = `${col},${firstY}`;
	});
	return {
		mapMap,
		wrapMap,
		start
	};
};

const cwTurns = {
	'right': 'down',
	'down': 'left',
	'left': 'up',
	'up': 'right',
};
const ccwTurns = {
	'right': 'up',
	'up': 'left',
	'left': 'down',
	'down': 'right',
};
const directionAdders = {
	'right': [1,0],
	'down': [0,1],
	'left': [-1,0],
	'up': [0,-1],
};
const projectCoords = (coordString, direction) => {
	const splits = coordString.split(',').map((n) => n * 1)
	const newCoords = [
		directionAdders[direction][0] + splits[0],
		directionAdders[direction][1] + splits[1],
	]
	return newCoords.join(',');
};

const facingPointsMap = {
	'right': 0,
	'down': 1,
	'left': 2,
	'up': 3,
};
const drawFacingMap = {
	'right': me.styleText('>','yellow'),
	'down': me.styleText('v','yellow'),
	'left': me.styleText('<','yellow'),
	'up': me.styleText('^','yellow'),
};

const puzzle = (text) => {
	const splits = text.split('\n\n');
	const map = splits[0];
	const steps = splits[1].trim();
	const {mapMap, wrapMap, start} = makeMapMaps(map);
	const findStep = new RegExp(/([0-9]+)([RL]*)/g);
	// // for map drawing
	// const drawSteps = {};
	// const tempSplits = map.split('\n');
	// const height = tempSplits.length;
	// const width = tempSplits[0].length;
	// state etc
	let position = start;
	let direction = 'right';
	let step = findStep.exec(steps);
	while (step) {
		const count = step[1] * 1;
		const turn = step[2];
		for (let stepCount = 1; stepCount <= count; stepCount++) {
			// walk the steps
			let tryCoords = projectCoords(position, direction);
			if (!mapMap[tryCoords]) {
				tryCoords = wrapMap[`${position}-${direction}`];
			}
			if (mapMap[tryCoords] === '#') { // rock
				break;
			}
			// drawSteps[position] = drawFacingMap[direction]; // STYLED YELLOW FOR FUNSIES
			position = tryCoords;
			// drawSteps[position] = me.styleText('@','white');
			// const header = `step count: ${stepCount}/${count} --> ${direction}\npos: ${position}`
			// drawMapCentered(mapMap, drawSteps, header, position);
		}
		// do the turn
		const oldDir = direction;
		if (turn === 'R') { // cw
			direction = cwTurns[direction];
		} else if (turn === 'L') { // ccw
			direction = ccwTurns[direction];
		}
		// drawSteps[position] = me.styleText('@','white');
		// const header = `step count: X/${count} --> ${oldDir} turning ${turn || '--'} (now ${direction})\npos: ${position}`
		// drawMapCentered(mapMap, drawSteps, header, position);
		step = findStep.exec(steps);
	}
	// drawSteps[position] = drawFacingMap[direction];
	// drawMap(
	// 	mapMap,
	// 	drawSteps,
	// 	[1, 1],
	// 	[width, height]
	// );
	const finalAnswer = position.split(',').map((n) => n * 1);
	return 1000 * finalAnswer[1]
		+ 4 * finalAnswer[0]
		+ facingPointsMap[direction];
};

const drawMapCentered = (mapMap, drawSteps, header, centerAsString, radius = 4) => {
	console.log('------------------------');
	console.log(header);
	const splits = centerAsString.split(',').map((n) => n * 1)
	const upperLeft = splits.map((n) => n - radius);
	const lowerRight = splits.map((n) => n + radius);
	drawMap(mapMap, drawSteps, upperLeft, lowerRight);
};

const drawMap = (mapMap, drawSteps, upperLeft, lowerRight) => {
	const lines = [];
	for (let rowIndex = upperLeft[1]; rowIndex <= lowerRight[1]; rowIndex++) {
		let line = '';
		for (let colIndex = upperLeft[0]; colIndex <= lowerRight[0]; colIndex++) {
			const label = `${colIndex},${rowIndex}`;
			let char = drawSteps[label] || mapMap[label] || ' ';
			if (char === '#') {
				char = me.styleText('#','red');
			}
			line += char;
		}
		lines.push(line);
	}
	const result = lines.join('\n');
	console.log(result);
	return result;
};

console.log(me.unitTestResults(
	'Sample input',
	6032,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText)); // answer: 30552
