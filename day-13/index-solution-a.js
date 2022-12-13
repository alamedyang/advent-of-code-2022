const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 13;

// started: launch
// ended: 11:56pm

const collectBetween = (string) => {
	if (string[0] !== '[') {
		return false;
	}
	let stack = 0;
	let pc = 0;
	let collection = '';
	do {
		const char = string[pc];
		if (char === '[') {
			stack += 1;
		} else if (char === ']') {
			stack -= 1;
		}
		collection += char;
		pc += 1;
	} while (pc < string.length && stack > 0)
	return collection;
};

const findNextChunk = (string) => {
	if (string[0] === '[') {
		return collectBetween(string);
	} else if (string.length === 0) {
		return false;
	} else {
		const match = string.match(/^([0-9]+),?/);
		return match[1];
	}
};

const asInteger = (value) => {
	const numberOnly = value.match(/^[0-9]+/);
	return numberOnly ? parseInt(value,10) : false;
};

const comparePairs = (pair1, pair2) => {
	// -1 means out of order
	// 1 means in order
	// 0 means they're the same
	let done1 = '';
	let done2 = '';
	let remaining1 = pair1.substring(1,pair1.length-1);
	let remaining2 = pair2.substring(1,pair2.length-1);
	if (remaining1.length === 0 && remaining2.length === 0) {
		return 0;
	} else if (remaining1.length === 0) {
		return 1;
	} else if (remaining2.length === 0) {
		return -1;
	}
	while (remaining1.length && remaining2.length) {
		let curr1 = findNextChunk(remaining1);
		let curr2 = findNextChunk(remaining2);
		const curr1size = curr1.length;
		const curr2size = curr2.length;
		// they're both numbers:
		if (asInteger(curr1) !== false && asInteger(curr2) !== false) {
			if (asInteger(curr1) < asInteger(curr2)) {
				return 1;
			} else if (asInteger(curr1) > asInteger(curr2)) {
				return -1;
			}
		} else {
			// make the non-integer an array
			if (asInteger(curr1) !== false) {
				curr1 = '[' + curr1 + ']';
			} else if (asInteger(curr2) !== false) {
				curr2 = '[' + curr2 + ']';
			}
			const arrayComparison = comparePairs(curr1, curr2);
			if (arrayComparison !== 0) {
				return arrayComparison;
			}
		}
		// they're the same, so proceed:
		done1 += done1.length ? ',' + curr1 : curr1;
		done2 += done2.length ? ',' + curr2 : curr2;
		remaining1 = remaining1.substring(curr1size);
		remaining2 = remaining2.substring(curr2size);
		if (remaining1[0] === ',') {
			remaining1 = remaining1.substring(1);
		}
		if (remaining2[0] === ',') {
			remaining2 = remaining2.substring(1);
		}
		if (remaining1.length === 0 && remaining2.length === 0) {
			return 0;
		} else if (remaining1.length === 0) {
			return 1;
		} else if (remaining2.length === 0) {
			return -1;
		}
	}
};

const puzzle = (text) => {
	let tally = 0;
	const pairs = text.split('\n\n');
	pairs.forEach((pair, index) => {
		const pairs = pair.split('\n')
		const result = comparePairs(pairs[0],pairs[1]);
		if (result === 1) {
			tally += index + 1;
		}
	})
	return tally;
};

console.log(me.unitTestResults(
	'Pair 1', 1, comparePairs('[1,1,3,1,1]','[1,1,5,1,1]')
));
console.log(me.unitTestResults(
	'Pair 2', 1, comparePairs('[[1],[2,3,4]]','[[1],4]')
));
console.log(me.unitTestResults(
	'Pair 3', -1, comparePairs('[9]','[[8,7,6]]')
));
console.log(me.unitTestResults(
	'Pair 4', 1, comparePairs('[[4,4],4,4]','[[4,4],4,4,4]')
));
console.log(me.unitTestResults(
	'Pair 5', -1, comparePairs('[7,7,7,7]','[7,7,7]')
));
console.log(me.unitTestResults(
	'Pair 6', 1, comparePairs('[]','[3]')
));
console.log(me.unitTestResults(
	'Pair 7', -1, comparePairs('[[[]]]','[[]]')
));
console.log(me.unitTestResults(
	'Pair 8', -1, comparePairs('[1,[2,[3,[4,[5,6,7]]]],8,9]','[1,[2,[3,[4,[5,6,0]]]],8,9]')
));

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
// 5857 too high
// 5731 too low
