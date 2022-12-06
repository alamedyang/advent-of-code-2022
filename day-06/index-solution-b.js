const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8').trim();

const samples = [
	{
		"input": "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
		"answer": 19
	},
	{
		"input": "bvwbjplbgvbhsrlpgdmjqwftvncz",
		"answer": 23
	},
	{
		"input": "nppdvjthqldpwncqszvftbrmjlhg",
		"answer": 23
	},
	{
		"input": "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
		"answer": 29
	},
	{
		"input": "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
		"answer": 26
	},
]

// started: 10:09pm
// ended: 10:11pm

const isUnique = (array) => {
	const inSet = {};
	array.forEach((char) => {
		inSet[char] = (inSet[char] || 0) + 1;
	});
	const multiples = Object.values(inSet).filter((count) => {
		return count > 1;
	})
	return !multiples.length;
};

const puzzle = (inputText) => {
	const text = inputText;
	const buffer = [];
	let pc = 14;
	for (let i = 0; i < pc; i++) {
		buffer.push(inputText[i]);
	}
	while (!isUnique(buffer)) {
		buffer.shift();
		buffer.push(inputText[pc]);
		pc += 1;
	}
	return pc;
};

console.log(`sample 1 (should be ${samples[0].answer}): ${puzzle(samples[0].input)}`);
console.log(`sample 2 (should be ${samples[1].answer}): ${puzzle(samples[1].input)}`);
console.log(`sample 3 (should be ${samples[2].answer}): ${puzzle(samples[2].input)}`);
console.log(`sample 4 (should be ${samples[3].answer}): ${puzzle(samples[3].input)}`);
console.log(`sample 5 (should be ${samples[4].answer}): ${puzzle(samples[4].input)}`);
console.log("real input:", puzzle(fileText));
