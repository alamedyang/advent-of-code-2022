const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch!
// ended: 10:15pm

const splits = fileText.split('\n');

const charToNumber = (char) => {
	const code = char.charCodeAt(0);
	return code < 91 ? code - 64 + 26 : code - 96;
};

const rucksacks = splits.map((line) => {
	const size = line.length / 2;
	const compartment1 = line.substring(0, size);
	const compartment2 = line.substring(size);
	return [compartment1, compartment2];
})

// console.log(compartments);

const inCommon = rucksacks.map((rucksack) => {
	const inFirst = {};
	rucksack[0].split('').forEach((char) => {
		inFirst[char] = true;
	})
	const common = {};
	rucksack[1].split('').forEach((char) => {
		if (inFirst[char]) {
			common[char] = true;
		}
	})
	return Object.keys(common);
})
console.log(inCommon);

const priorities = inCommon.map((array) => charToNumber(array[0]));

const priority = priorities.reduce((prev, cur) => prev + cur, 0);
console.log(priority);

console.log('breakpoint lol');
