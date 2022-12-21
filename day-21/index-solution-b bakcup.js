const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 10:21pm
// ended: 

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
	} else if (sign === '===') {
		return () => monkeys[arg1]() === monkeys[arg2]();
	}
};

const undoXY = {
	'+': (y, c) => c - y,
	'-': (y, c) => c + y,
	'/': (y, c) => c * y,
	'*': (y, c) => c / y,
};

const undoYX = {
	'+': (y, c) => c - y,
	'-': (y, c) => -c + y,
	'/': (y, c) => y / c,
	'*': (y, c) => c / y,
};

const puzzle = (text) => {
	// prepare input data
	const monkeys = {};
	const monkeysRaw = {};
	text.split('\n')
		.forEach((line) => {
			const splits = line.split(': ');
			const funky = splits[1].split(' ');
			if (splits[0] === 'root') {
				monkeys[splits[0]] = makeFunky(monkeys, funky[0], funky[2], '===');
			} else {
				const func = splits[1].includes(' ')
					? makeFunky(monkeys, funky[0], funky[2], funky[1])
					: () => parseInt(splits[1], 10);
				monkeys[splits[0]] = func;
			}
			monkeysRaw[splits[0]] = splits[1].includes(' ')
				? {
					arg1: funky[0],
					arg2: funky[2],
					op: funky[1],
				}
				: {
					value: splits[1],
				}
		});
	// make correction
	monkeys.humn = () => {
		return 'HUMAN'
	}
	// recursion crap
	const solveForX = (arg1, arg2, op, eq) => {
		const arg1Value = monkeys[arg1]();
		const arg2Value = monkeys[arg2]();
		if (arg1Value === 'HUMAN') {
			// X op Y = equalityTarget
			const y = monkeys[arg2]();
			return undoXY[op](y, eq);
		} else if (arg2Value === 'HUMAN') {
			// Y op X = equalityTarget
			const y = monkeys[arg1]();
			return undoYX[op](y, eq);
		} else {
			if (Number.isNaN(arg1Value)) {
				const unknown = arg1;
				const known = arg2;
				const knownValue = arg2Value;
				const problem = monkeysRaw[unknown];
				const nowKnown = solveForX(
					problem.arg1, problem.arg2, problem.op, knownValue
				);
				return undoXY[op](eq, nowKnown);
			} else if (Number.isNaN(arg2Value)) {
				const unknown = arg2;
				const known = arg1;
				const knownValue = arg1Value;
				const problem = monkeysRaw[unknown];
				const nowKnown = solveForX(
					problem.arg1, problem.arg2, problem.op, knownValue
				);
				return undoYX[op](eq, nowKnown);
			}
		}
	};
	const arg1 = monkeysRaw.root.arg1;
	const arg2 = monkeysRaw.root.arg2;
	const arg1Value = monkeys[arg1]();
	const arg2Value = monkeys[arg2]();
	let unknown;
	let known;
	let knownValue;
	if (Number.isNaN(arg1Value)) {
		unknown = arg1;
		known = arg2;
		knownValue = arg2Value;
	} else if (Number.isNaN(arg2Value)) {
		unknown = arg2;
		known = arg1;
		knownValue = arg1Value;
	}
	const problem = monkeysRaw[unknown];
	return solveForX(
		problem.arg1,
		problem.arg2,
		problem.op,
		knownValue
	);
};

/*
((4 + (2 * (humn - 3))) / 4) === 150
(4 + (2 * (humn - 3))) === 600
(2 * (humn - 3)) === 596
humn - 3 === 298
humn === 301



root
pppw === sjmn
(cczh / lfqf) === (drzm * dbpl)
((sllz + lgvd) / 4) === ((hmdt - zczc) * 5)
((4 + (ljgn * ptdq)) / 4) === ((32 - 2) * 5)
((4 + (2 * (humn - 3))) / 4) === ((32 - 2) * 5)
((4 + (2 * (humn - dvpt))) / 4) === 150


*/

console.log(me.unitTestResults(
	'Sample input',
	301,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
