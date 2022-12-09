const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');
const sampleDataPath2 = path.join(__dirname , 'sample-input2.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');
const sampleFileText2 = fs.readFileSync(sampleDataPath2, 'utf-8');

const sampleAnswer = 1;
const sampleAnswer2 = 36;

// started: 10:27pm
// ended: 11:24pm

const doGap = (head,tail) => {
	const xGap = head[0] - tail[0];
	const yGap = head[1] - tail[1];
	if (
		Math.abs(xGap) <= 1
		&& Math.abs(yGap) <= 1
	) {
		return tail.slice();
	} else {
		if (Math.abs(xGap) === Math.abs(yGap)) {
			const signX = Math.sign(xGap);
			const signY = Math.sign(yGap);
			const newTail = head.slice();
			newTail[0] -= signX;
			newTail[1] -= signY;
			return newTail;
		} else {
			const mostGappingCoord = Math.abs(xGap) > Math.abs(yGap) ? 0 : 1; // aka x : y
			const mostGappingDist = Math.abs(xGap) > Math.abs(yGap) ? xGap : yGap;
			const sign = Math.sign(mostGappingDist);
			const newTail = head.slice();
			newTail[mostGappingCoord] -= sign;
			return newTail;
		}
	}
};

const directionMap = {
	"R": [1,0],
	"L": [-1,0],
	"U": [0,1],
	"D": [0,-1],
};

const drawSnake = (head, tails) => {
	const combo = [head].concat(tails);
	const minX = combo.map((coords)=>coords[0]).reduce((prev,cur)=>Math.min(prev,cur),Infinity);
	const maxX = combo.map((coords)=>coords[0]).reduce((prev,cur)=>Math.max(prev,cur),-Infinity);
	const minY = combo.map((coords)=>coords[1]).reduce((prev,cur)=>Math.min(prev,cur),Infinity);
	const maxY = combo.map((coords)=>coords[1]).reduce((prev,cur)=>Math.max(prev,cur),-Infinity);
	const sizeX = maxX - minX;
	const sizeY = maxY - minY;
	const row = []
	row.length = sizeX + 1;
	row.fill('.');
	const rows = [];
	for (let i = 0; i <= sizeY; i++) {
		rows.push(row.slice());
	}
	const plotChar = (x,y,char) => {
		const realX = x - minX;
		const realY = y - minY;
		rows[realY][realX] = char;
	}
	combo.forEach((coord,index) => {
		const char = index === 0 ? 'H' : index;
		plotChar(coord[0],coord[1],char);
	})
	const result = rows.reverse().map((row) => row.join('')).join('\n');
	console.log('\n'+result);
	return result;
};

const drawVisited = (visited) => {
	const combo = Object.keys(visited).map((string) => {
		return string.split(',').map((value)=>parseInt(value,10));
	})
	const minX = combo.map((coords)=>coords[0]).reduce((prev,cur)=>Math.min(prev,cur),Infinity);
	const maxX = combo.map((coords)=>coords[0]).reduce((prev,cur)=>Math.max(prev,cur),-Infinity);
	const minY = combo.map((coords)=>coords[1]).reduce((prev,cur)=>Math.min(prev,cur),Infinity);
	const maxY = combo.map((coords)=>coords[1]).reduce((prev,cur)=>Math.max(prev,cur),-Infinity);
	const sizeX = maxX - minX;
	const sizeY = maxY - minY;
	const row = []
	row.length = sizeX + 1;
	row.fill('.');
	const rows = [];
	for (let i = 0; i <= sizeY; i++) {
		rows.push(row.slice());
	}
	const plotChar = (x,y,char) => {
		const realX = x - minX;
		const realY = y - minY;
		rows[realY][realX] = char;
	}
	combo.forEach((coord,index) => {
		const char = index === 0 ? 's' : '#';
		plotChar(coord[0],coord[1],char);
	})
	const result = rows.reverse().map((row) => row.join('')).join('\n');
	console.log('\n'+result);
	return result;
};

const puzzle = (inputText) => {
	const text = inputText.trim();
	const head = [0,0];
	let tails = [];
	for (let i = 0; i < 9; i++) {
		tails.push([0,0]);
	}
	const visited = { "0,0": true };
	text.split('\n').forEach((move) => {
		// console.log('   ' + move);
		const splits = move.split(' ');
		const direction = splits[0];
		const distance = parseInt(splits[1],10);
		for (let i = 0; i < distance; i++) {
			head[0] = head[0] + directionMap[direction][0];
			head[1] = head[1] + directionMap[direction][1];
			const newTails = [];
			tails.forEach((origTail,index)=>{
				const localHead = index === 0 ? head : newTails[index-1];
				const result = doGap(localHead,origTail);
				newTails.push(result);
			})
			tails = newTails;
			visited[tails[8][0] + "," + tails[8][1]] = true;
			// drawSnake(head, tails);
		}
	})
	// drawVisited(visited);
	return Object.keys(visited).length;
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log(me.unitTestResults(
	'Sample input 2',
	sampleAnswer2,
	puzzle(sampleFileText2)
));
console.log("real input:", puzzle(fileText));
