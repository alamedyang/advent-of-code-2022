const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 11:35pm
// ended: 11:38pm

const decryptionKey = 811589153;

const puzzle = (text) => {
	const salvaged = text.split('\n')
		.map((number) => parseInt(number,10) * decryptionKey)
		.map((number, index) => {
			return {
				origIndex: index,
				value: parseInt(number,10),
			};
		});
	for (let mix = 0; mix < 10; mix++) {
		for (let i = 0; i < salvaged.length; i++) {
			const originIndex = salvaged.findIndex((item) => item.origIndex === i);
			const value = salvaged[originIndex].value;
			const destinationIndex = (originIndex + value) % (salvaged.length - 1);
			if (value === 0) {
				// do nothing
			} else if (destinationIndex === 0) {
				excised = salvaged.splice(originIndex,1);
				salvaged.push(excised[0]);
			} else if (destinationIndex !== 0) {
				excised = salvaged.splice(originIndex,1);
				salvaged.splice(destinationIndex,0,excised[0]);
			}
		}
	}
	const report = [
		1000,
		2000,
		3000
	].map((th) => {
		const zeroIndex = salvaged.findIndex((item) => item.value === 0);
		const targetIndex = (th + zeroIndex) % salvaged.length;
		return salvaged[targetIndex].value;
	});
	console.log(report);
	return report.reduce((prev,curr)=>prev+curr,0);
};

console.log(me.unitTestResults(
	'Sample input',
	1623178306,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
