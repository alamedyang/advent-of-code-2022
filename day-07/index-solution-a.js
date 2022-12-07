const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

const sampleAnswer = 95437;

// started: launch!
// ended: 11:21pm

const buildFS = (text) => {
	const fs = {
		"/": {
			parent: null,
			files: {},
			directories: {},
			dirName: "/",
			fullPath: "/",
		}
	};
	let curDir = fs["/"];
	const makeDir = (name) => {
		if (!curDir.directories[name]) {
			const curPath = curDir.fullPath;
			curDir.directories[name] = {
				parent: curDir,
				files: {},
				directories: {},
				dirName: name,
				fullPath: curPath + '/' + name,
			}
		}
	};
	const makeFile = (name, size) => {
		curDir.files[name] = size;
	};
	const lines = text.split('\n');
	let pc = 0;
	const getLine = () => {
		const result = lines[pc];
		// console.log(result);
		pc += 1;
		return result.split(' ');
	}
	while (pc < lines.length) {
		const splits = getLine();
		if (splits[0] === "$") {
			if (splits[1] === "cd") {
				const path = splits[2];
				if (path === "/") {
					// console.log('   warp to root');
					curDir = fs["/"];
				} else if (path === '..') {
					// console.log('   retreating...');
					curDir = curDir.parent;
				} else {
					curDir = curDir.directories[path];
					// console.log('   I\'m in!');
				}
			} else if (splits[1] === "ls") {
				do {
					const line = getLine();
					if (line[0] === "dir") {
						makeDir(line[1]);
						// console.log('   found dir ' + line[1]);
						// console.log(`   adding to ${curDir.fullPath}`);
					} else {
						makeFile(line[1], parseInt(line[0],10))
						// console.log(`   found file ${line[1]} (${line[0]})`);
						// console.log(`   adding to ${curDir.fullPath}`);
					}
				} while (
					lines[pc]
					&& !lines[pc].includes("$")
				)
			}
		}
	}
	return fs;
};
const getFileSizeSum = (files) => {
	return Object.values(files).reduce((prev, cur) => prev + cur, 0);
}

const collectDirs = (firstDir) => {
	const foundDirs = [];
	let dirsToCrawl = [firstDir];
	let newDirsToCrawl = [];
	while (dirsToCrawl.length) {
		dirsToCrawl.forEach((dir) => {
			foundDirs.push(dir);
			Object.values(dir.directories).forEach((dir)=>{
				newDirsToCrawl.push(dir);
			})
		})
		dirsToCrawl = newDirsToCrawl;
		newDirsToCrawl = [];
	}
	return foundDirs;
}

const getFileSizeSumRecursive = (dir) => {
	const crawledDirs = collectDirs(dir);
	let sum = 0;
	crawledDirs.forEach((dir) => {
		sum += getFileSizeSum(dir.files);
	})
	return sum;
}

const puzzle = (inputText) => {
	const text = inputText.trim();
	const fs = buildFS(text);
	const dirs = collectDirs(fs["/"]);
	const sizesMap = {};
	dirs.forEach((dir) => {
		sizesMap[dir.fullPath] = getFileSizeSumRecursive(dir);
	})
	console.log(sizesMap);
	return Object.values(sizesMap)
		.filter((total) => total <= 100000)
		.reduce((prev, cur) => prev + cur, 0);
}

// console.log(me.unitTestResults(
// 	'Sample input',
// 	sampleAnswer,
// 	puzzle(sampleFileText)
// ));
// 892030 is wrong
console.log("Real input:", puzzle(fileText));
