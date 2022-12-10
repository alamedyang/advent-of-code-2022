const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

const sampleAnswer = 13140;

// started: launch!
// ended: 10:17pm

const isCaptureCycle = (number) => {
	return ((number - 20) % 40) === 0;
};

const puzzle = (inputText) => {
	const text = inputText.trim();
	let cycleCount = 0;
	const capturedCycles = [];
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
	text.split('\n').forEach((line) => {
		const splits = line.split(' ');
		const op = instructionMap[splits[0]];
		for (let i = 0; i < op.cycleCount; i++) {
			cycleCount += 1;
			if (isCaptureCycle(cycleCount)) {
				capturedCycles.push({
					cycleCount: cycleCount,
					x: x
				})
			}
			if (i === op.cycleCount - 1) {
				op.doFunc(splits[1]);
			}
		}
	})
	const signals = capturedCycles.map((item) => item.x * item.cycleCount );
	return signals.reduce((prev,cur) => prev+cur,0);
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
