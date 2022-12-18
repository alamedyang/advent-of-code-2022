const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch
// ended: 

const puzzle = (text) => {

	
};

console.log(me.unitTestResults(
	'Sample input',
	null,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
