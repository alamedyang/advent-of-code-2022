const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

// started: launch!
// ended: 

const puzzle = (inputText) => {
	const text = inputText.trim();

	
};

console.log("sample input:", puzzle(sampleFileText));
console.log("real input:", puzzle(fileText));
