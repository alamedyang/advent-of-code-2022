const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

const sampleAnswer = 13;

// started: launch!
// ended: 10:27pm

const doGap = (head,tail) => {
	const xGap = head[0] - tail[0];
	const yGap = head[1] - tail[1];
	if (
		Math.abs(xGap) <= 1
		&& Math.abs(yGap) <= 1
	) {
		return tail.slice();
	} else {
		const mostGappingCoord = Math.abs(xGap) > Math.abs(yGap) ? 0 : 1; // aka x : y
		const mostGappingDist = Math.abs(xGap) > Math.abs(yGap) ? xGap : yGap;
		const sign = Math.sign(mostGappingDist);
		const newTail = head.slice();
		newTail[mostGappingCoord] -= sign;
		return newTail;
	}
};

const directionMap = {
	"R": [1,0],
	"L": [-1,0],
	"U": [0,1],
	"D": [0,-1],
};

const puzzle = 
(inputText) => {
	const text = inputText.trim();
	const head = [0,0];
	let tail = [0,0];
	const visited = { "0,0": true };
	text.split('\n').forEach((move) => {
		// console.log(move);
		const splits = move.split(' ');
		const direction = splits[0];
		const distance = parseInt(splits[1],10);
		for (let i = 0; i < distance; i++) {
			// console.log("HEAD MOVE: " + direction)
			head[0] = head[0] + directionMap[direction][0];
			head[1] = head[1] + directionMap[direction][1];
			tail = doGap(head,tail);
			visited[tail[0] + "," + tail[1]] = true;
		}
	})
	return Object.keys(visited).length;
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
