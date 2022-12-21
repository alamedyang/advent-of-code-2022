const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch
// ended: 10:21pm

const makeFunky = (monkeys, arg1, arg2, sign) => {
	// hardcoding lulul
	if (sign === '+') {
		return () => monkeys[arg1]() + monkeys[arg2]();
	} else if (sign === '-') {
		return () => monkeys[arg1]() - monkeys[arg2]();
	} else if (sign === '*') {
		return () => monkeys[arg1]() * monkeys[arg2]();
	} else if (sign === '/') {
		return () => monkeys[arg1]() / monkeys[arg2]();
	}
}

const puzzle = (text) => {
	const monkeys = {};
	text.split('\n')
		.forEach((line) => {
			const splits = line.split(': ');
			const funky = splits[1].split(' ');
			const func = splits[1].includes(' ')
				? makeFunky(monkeys, funky[0], funky[2], funky[1])
				: () => parseInt(splits[1], 10);
			monkeys[splits[0]] = func;
		});
	return monkeys.root();
};

console.log(me.unitTestResults(
	'Sample input',
	152,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
