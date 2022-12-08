const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

const sampleAnswer = 21;

// started: launch!
// ended: 11:12pm

const puzzle = (inputText) => {
	const text = inputText.trim();
	const rows = text.split('\n').map((row)=> {
			return row.split('').map((tree) => parseInt(tree,10));
		})
	const visible = rows.map((row) => {
		return row.map((tree) => null);
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
			if (
				ups.length === 0
				|| downs.length === 0
				|| lefts.length === 0
				|| rights.length === 0
			) {
				visible[rowIndex][colIndex] = true;
			} else {
				shorterUps = ups.filter((checkTree)=>checkTree < treeSize);
				shorterDowns = downs.filter((checkTree)=>checkTree < treeSize);
				shorterLefts = lefts.filter((checkTree)=>checkTree < treeSize);
				shorterRights = rights.filter((checkTree)=>checkTree < treeSize);

				if (
					ups.length === shorterUps.length
					|| downs.length === shorterDowns.length
					|| lefts.length === shorterLefts.length
					|| rights.length === shorterRights.length
				) {
					visible[rowIndex][colIndex] = true;
				} else {
					visible[rowIndex][colIndex] = false;
				}
			}
		})
	})

	// diagnose :(
	let diag = visible.map((row) => {
		return row.map((col) => {
			return col ? 'V':'.';
		}).join('')
	}).join('\n');
	console.log(diag)
	// total
	let tally = 0;
	visible.forEach((row) => {
		row.forEach((tree) => {
			if (tree === true) {
				tally += 1;
			}
		})
	})
	return tally;
};

console.log(me.unitTestResults(
	'Sample input:',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
