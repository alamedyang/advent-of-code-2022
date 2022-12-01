const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8').trim();

// started 12:32pm
// finished 12:36pm

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

const sortedElves = elfCalories.sort((a, b) => b - a);



console.log(sortedElves[0]);
console.log(sortedElves[1]);
console.log(sortedElves[2]);

console.log("TOP 3")
console.log(sortedElves[0] + sortedElves[1] + sortedElves[2]) // TOO LOW