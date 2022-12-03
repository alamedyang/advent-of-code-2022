const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 10:15pm
// ended: 10:23pm

const splits = fileText.split('\n');

const charToNumber = (char) => {
	const code = char.charCodeAt(0);
	return code < 91 ? code - 64 + 26 : code - 96;
};

const groupCount = splits.length / 3;
const badgeChars = [];
for (let i = 0; i < groupCount; i++) {
	const firstIndex = i * 3;
	const inFirst = {};
	splits[firstIndex].split('').forEach((char) => {
		inFirst[char] = true;
	})
	const common = [];
	Object.keys(inFirst).forEach((char) => {
		if (
			splits[firstIndex+1].includes(char)
			&& splits[firstIndex+2].includes(char)
		) {
			common.push(char);
		}
	})
	badgeChars.push(common);
}
console.log(badgeChars);

const priorities = badgeChars.map((array) => charToNumber(array[0]));
const priority = priorities.reduce((prev, cur) => prev + cur, 0);
console.log(priority);

console.log('breakpoint lol');
