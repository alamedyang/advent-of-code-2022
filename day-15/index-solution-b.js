const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 56000011;
const sampleYRange = 20;
const realYRange = 4000000;

// started: 11:14pm
// ended: 11:48pm

const makeCoordsUnflat = (string) => {
	return string.split(',')
		.map((number)=>parseInt(number,10))
};

const makeCoordsFlat = (array) => {
	return `${array[0]},${array[1]}`;
};

const getManhat = (a, b) => {
	const aSplits = makeCoordsUnflat(a);
	const bSplits = makeCoordsUnflat(b);
	const xDiff = bSplits[0] - aSplits[0];
	const yDiff = bSplits[1] - aSplits[1];
	return Math.abs(xDiff) + Math.abs(yDiff);
};

const sortArrays = (array1, array2) => {
	// sorts left edge
	return array1[0] - array2[0];
};
const doArraysOverlap = (array1, array2) => {
	const sorted = [array1,array2].sort(sortArrays);
	return sorted[0][1] >= sorted[1][0];
};

const addArrays = (array1, array2) => {
	const sorted = [array1,array2].sort(sortArrays);
	if (!doArraysOverlap(sorted[0], sorted[1])) {
		return false;
	} else {
		return [
			Math.min(array1[0], array2[0]),
			Math.max(array1[1], array2[1]),
		]
	}
};

const reduceAndClampArrays = (inputArray, clamp) => {
	const source = inputArray.slice()
		.filter((range) => {
			return range[1] >= 0 || range[0] <= clamp;
		})
		.map((range) => {
			return [
				Math.max(0, range[0]),
				Math.min(clamp, range[1]),
			]
		});
	if (!source.length) {
		return false;
	}
	source.sort(sortArrays);
	const reduced = [ source.shift() ];
	while (source.length) {
		const next = source.shift();
		const addedTest = addArrays(
			reduced[reduced.length-1],
			next
		);
		if (addedTest) {
			reduced[reduced.length-1] = addedTest;
		} else {
			reduced.push(next);
		}
	}
	return reduced;
};

const insideZoneOfInhibition = (sensor, beacon, test) => {
	return !(getManhat(sensor, beacon) <= getManhat(sensor, test));
};

const puzzle = (text, clamp) => {
	const ranges = {
		minX: Infinity,
		maxX: -Infinity,
		minY: Infinity,
		maxY: -Infinity,
	}
	const data = text.split('\n')
		.map((line)=>{
			const splits = line.replaceAll(', y=', ',')
				.replace('Sensor at x=','')
				.split(': closest beacon is at x=');
			splits.forEach((string)=>{
				const coords = makeCoordsUnflat(string);
				ranges.minX = Math.min(ranges.minX, coords[0]);
				ranges.maxX = Math.max(ranges.maxX, coords[0]);
				ranges.minY = Math.min(ranges.minY, coords[1]);
				ranges.maxY = Math.max(ranges.maxY, coords[1]);
			})
			return {
				"sensor": splits[0],
				"beacon": splits[1],
			}
		})
	data.forEach((entry)=>{
		entry.manhattanDist = getManhat(
			entry.sensor,
			entry.beacon
		);
	})
	
	// brute force baybeee
	for (let forLoopIndex = 0; forLoopIndex <= clamp; forLoopIndex++) {
		const linePairs = [];
		data.forEach((entry)=>{
			const sensorSplits = makeCoordsUnflat(entry.sensor);
			const straightDownAtLine = `${sensorSplits[0]},${forLoopIndex}`;
			if (insideZoneOfInhibition(
				entry.sensor,
				entry.beacon,
				straightDownAtLine
			)) {
				const distFromCenter = Math.abs(forLoopIndex - sensorSplits[1]);
				const remainder = entry.manhattanDist - distFromCenter;
				linePairs.push([
					sensorSplits[0] - remainder,
					sensorSplits[0] + remainder,
				])
				entry.minX = sensorSplits[0] - remainder;
				entry.maxX = sensorSplits[0] + remainder;
			}
		})
		// console.log(linePairs);
		const reduction = reduceAndClampArrays(linePairs, clamp);
		if (reduction === false) {
			throw new Error(`Y of ${forLoopIndex} broke somehow!`);
		} else if (reduction.length === 2) {
			return (reduction[0][1] + 1) * 4000000 + forLoopIndex;
		} else if (reduction.length > 2) {
			throw new Error(`More than one hole found at Y of ${forLoopIndex}!`);
		}
	}
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText, sampleYRange)
));
console.log("real input:", puzzle(fileText, realYRange));
// NOTE: this is not very fast :/
