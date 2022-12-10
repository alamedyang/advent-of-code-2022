const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

const sampleAnswer = `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....`;

// started: 10:17pm
// ended: 10:38pm

const puzzle = (inputText) => {
	const text = inputText.trim();
	// screen
	const row = [];
	row.length = 40;
	row.fill('-'); // "static"
	const rows = [];
	for (let i = 0; i < 6; i++) {
		rows.push(row.slice());
	}
	// from last time
	let cycleCount = 0;
	let x = 1;
	const instructionMap = {
		"noop": {
			cycleCount: 1,
			doFunc: () => {}
		},
		"addx": {
			cycleCount: 2,
			doFunc: (number) => { x += parseInt(number,10) }
		},
	}
	// draw pixel
	const drawPixel = () => {
		const row = Math.floor(cycleCount / 40);
		const col = cycleCount % 40;
		const diff = Math.abs(col - x);
		let char = '_';
		if (
			diff <= 1
		) {
			char = '#';
		} else {
			char = '.';
		}
		rows[row][col] = char;
	};
	text.split('\n').forEach((line) => {
		const splits = line.split(' ');
		const op = instructionMap[splits[0]];
		for (let i = 0; i < op.cycleCount; i++) {
			drawPixel();
			cycleCount += 1;
			if (i === op.cycleCount - 1) {
				op.doFunc(splits[1]);
			}
		}
	})
	const screen = rows.map((row) => {
		return row.join('');
	}).join('\n')
	return screen;
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log(puzzle(fileText));
