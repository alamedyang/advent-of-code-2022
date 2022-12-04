const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch!
// ended: 10:06pm

const splits = fileText.split('\n');

let tally = 0;
splits.forEach((pair) => {
	const elves = pair.split(',');
	let elf1 = elves[0].split('-').map((int) => parseInt(int));
	let elf2 = elves[1].split('-').map((int) => parseInt(int));
	if (
		(elf1[0] <= elf2[0] && elf1[1] >= elf2[1])
		|| (elf2[0] <= elf1[0] && elf2[1] >= elf1[1])
	) {
		tally += 1;
	}
})

console.log(tally);

console.log('breakpoint lol');
