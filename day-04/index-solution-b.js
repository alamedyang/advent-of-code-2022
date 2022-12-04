const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 10:06pm
// ended: 10:12pm

const splits = fileText.split('\n');

let tally = 0;
splits.forEach((pair) => {
	const elves = pair.split(',');
	const elf1 = elves[0].split('-').map((int) => parseInt(int));
	const elf2 = elves[1].split('-').map((int) => parseInt(int));
	const inFirst = {};
	for (let i = elf1[0]; i <= elf1[1]; i++) {
		inFirst[i] = true;
	}
	for (let i = elf2[0]; i <= elf2[1]; i++) {
		if (inFirst[i]) {
			tally += 1;
			break
		}
	}
})

console.log(tally);

console.log('breakpoint lol');
