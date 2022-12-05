const { createSecretKey } = require('crypto');
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8')
	// .trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8')
	// .trim();

// started: launch!
// ended: 10:27pm

const doCrane = (inputString) => {
	const splits = inputString.split('\n\n');
	const state = {};

	// initial crate state
	const lines = splits[0].split('\n');
	lines.forEach((line) => {
		for (let i = 0; i < line.length; i += 4) {
			if (line[i] != ' ') {
				const stack = (i / 4) + 1;
				state[stack] = state[stack] || [];
				state[stack].unshift(line[i+1]);
			} else {
			}
		}
	})

	// moves
	splits[1].trim().split('\n').forEach((move) => {
		const splits = move
			.replace('move ', '')
			.replace(' from ', ',')
			.replace(' to ', ',')
			.split(',');
		const count = parseInt(splits[0],10);
		const from = splits[1];
		const to = splits[2];
		for (let i = 0; i < count; i++) {
			const insert = state[from].pop();
			state[to].push(insert);
		}
	});
	const tops = Object.keys(state).map((stackNumber) => {
		const array = state[stackNumber];
		return array[array.length-1];
	})
	return tops.join('');
};


console.log("sample input:", doCrane(sampleFileText));
console.log("real input:", doCrane(fileText));


console.log('breakpoint lol');
