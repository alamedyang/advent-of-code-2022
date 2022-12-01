const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8').trim();

var splits = fileText.trim().split('\n');

// started 12:22pm Dec 1
// finished 12:32pm... NaN complications :(

var sample = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

const elves = fileText.split('\n\n');
const elfCalories = elves.map((elf) => {
	// can't remember reduce lul
	let sum = 0;
	elf.split('\n').forEach((calories) => {
		sum += parseInt(calories, 10);
	})
	return sum;
})

let max = 0;
elfCalories.forEach((elf, index) => {
	max = Math.max(elf, max);
})


console.log(max);