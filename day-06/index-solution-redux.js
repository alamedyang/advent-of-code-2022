const fs = require('fs');
const path = require('path');
const me = require('../me');

const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8').trim();

const tests = {
	"Sample input #1": {
		"input": "mjqjpqmgbljsphdztnvjfqwrcgsmlb",
		"answer1": 7,
		"answer2": 19,
	},
	"Sample input #2": {
		"input": "bvwbjplbgvbhsrlpgdmjqwftvncz",
		"answer1": 5,
		"answer2": 23,
	},
	"Sample input #3": {
		"input": "nppdvjthqldpwncqszvftbrmjlhg",
		"answer1": 6,
		"answer2": 23,
	},
	"Sample input #4": {
		"input": "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg",
		"answer1": 10,
		"answer2": 29,
	},
	"Sample input #5": {
		"input": "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw",
		"answer1": 11,
		"answer2": 26,
	},
	"Real input": {
		"input": fileText,
		"answer1": 1238,
		"answer2": 3037,
	},
};

const puzzle = (inputText, uniqueCharCount) => {
	const buffer = inputText.substring(0,uniqueCharCount)
		.split('');
	let pc = uniqueCharCount;
	while (
		me.getUniqueArrayItems(buffer).length
			!== buffer.length
	) {
		buffer.shift();
		buffer.push(inputText[pc]);
		pc += 1;
	}
	return pc;
};

console.log(me.styleText('   PART ONE','white'))
Object.keys(tests).forEach((testName) => {
	const test = tests[testName];
	const message = me.unitTestResults(
		testName,
		test.answer1,
		puzzle(test.input, 4)
	);
	console.log(message);
})

console.log(me.styleText('\n   PART TWO','white'))
Object.keys(tests).forEach((testName) => {
	const test = tests[testName];
	const message = me.unitTestResults(
		testName,
		test.answer2,
		puzzle(test.input, 14)
	);
	console.log(message);
})
