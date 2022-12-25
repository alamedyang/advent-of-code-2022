const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch
// ended: 10:22pm

const makeSNAFU = (n) => {
	const n5 = n.toString(5); //124030
	let next = 0;
	const digits = n5
		.split('')
		.reverse()
		.map((n) => {
			const number = parseInt(n) + next;
			let result = number;
			next = 0;
			if (number === 4) {
				result = '-'
				next += 1;
			} else if (number === 3) {
				result = '='
				next += 1;
			} else if (number === 5) {
				result = '0'
				next += 1;
			}
			return result;
		})
	if (next > 0) {
		digits.push(next);
	}
	return digits.reverse().join('');
};

const puzzle = (text) => {
	const lines = text.split('\n');
	const numbers = lines.map((n) => {
		const positive = n.split('')
			.map((char) => {
				return char === '=' || char === '-' ? '0' : char;
			}).join('');
		const negative = n.split('')
			.map((char) => {
				if (char === '=') { return '2' }
				else if (char === '-') { return '1' }
				else { return '0' }
			}).join('');
		return parseInt(positive, 5) - parseInt(negative, 5);
	});
	const result = numbers.reduce((prev, curr) => prev + curr, 0);
	return makeSNAFU(result);
};

console.log(me.unitTestResults(
	'Sample input',
	'2=-1=0', // 4890
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
