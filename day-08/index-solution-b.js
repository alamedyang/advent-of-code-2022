const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

const sampleAnswer = 8;

// started: 11:12pm
// ended: 11:44pm

const puzzle = (inputText) => {
	const text = inputText.trim();
	const rows = text.split('\n').map((row)=> {
			return row.split('').map((tree) => parseInt(tree,10));
		})
	const scores = rows.map((row) => {
		return row.map((tree) => 0);
	});
	//
	const collectLeft = (rowIndex, colIndex) => {
		return rows[rowIndex].slice(0,colIndex);
	};
	const collectRight = (rowIndex, colIndex) => {
		return rows[rowIndex].slice(colIndex+1);
	};
	const collectUp = (rowIndex, colIndex) => {
		const stripe = rows.map((row)=>row[colIndex]);
		return stripe.slice(0,rowIndex);
	};
	const collectDown = (rowIndex, colIndex) => {
		const stripe = rows.map((row)=>row[colIndex]);
		return stripe.slice(rowIndex+1);
	};
	rows.forEach((row,rowIndex)=>{
		row.forEach((treeSize,colIndex) => {
			const ups = collectUp(rowIndex,colIndex);
			const downs = collectDown(rowIndex,colIndex);
			const lefts = collectLeft(rowIndex,colIndex);
			const rights = collectRight(rowIndex,colIndex);
			const judgeFromStart = (treeSize, collected) => {
				const passed = [];
				for (let i = 0; i < collected.length; i++) {
					if (collected[i] < treeSize) {
						passed.push(treeSize);
					} else {
						passed.push(treeSize);
						break;
					}
				}
				return passed.length;
			};
			const judgeFromEnd = (treeValue, collected) => {
				const passed = [];
				for (let i = collected.length - 1; i >= 0; i--) {
					if (collected[i] < treeValue) {
						passed.push(treeValue);
					} else {
						passed.push(treeValue);
						break;
					}
				}
				return passed.length;
			};

			const upScore = judgeFromEnd(treeSize, ups);
			const downScore = judgeFromStart(treeSize, downs);
			const leftScore = judgeFromEnd(treeSize, lefts);
			const rightScore = judgeFromStart(treeSize, rights);
			scores[rowIndex][colIndex] = upScore * downScore * leftScore * rightScore;
		})
	})
	return scores.map((row)=>{
		return row.reduce((prev,cur)=>Math.max(prev,cur),0);
	}).reduce((prev,cur)=>Math.max(prev,cur),0);
	// 5332 too low
};

console.log(me.unitTestResults(
	'Sample input:',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
