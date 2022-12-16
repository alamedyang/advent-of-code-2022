const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 1651;

// started: launch
// ended: 1:59am

const makePathData = (text) => {
	const valves = {};
	text.split('\n').forEach((line)=>{
		const cleanLine = line
			.replace('Valve ','')
			.replace(' has flow rate=','|')
			.replace('valves ','valve ')
			.replace('tunnels ','tunnel ')
			.replace('lead ','leads ')
			.replace('; tunnel leads to valve ','|')
			.split('|');
		valves[cleanLine[0]] = {
			flowRate: parseInt(cleanLine[1],10),
			tunnels: cleanLine[2].split(', ')
		}
	})
	return valves;
};

const doTick = (state) => {
	state.currMinute += 1;
	state.totalReleasedPressure += state.currPressureRate;
};
const doMove = (state, targetRoom) => {
	doTick(state);
	state.currRoom = targetRoom;
}
const doValve = (state, paths) => {
	doTick(state);
	state.openValves.push(state.currRoom);
	state.currPressureRate += paths[state.currRoom].flowRate;
};

// const evaluatePathValue = (path, pathData) => {
// 	const state = {
// 		currMinute: 1,
// 		currRoom: 'AA',
// 		currPressureRate: 0,
// 		totalReleasedPressure: 0,
// 		openValves: [],
// 	};
// 	path.forEach((turn)=> {
// 		if (turn === 'open') {
// 			doValve(state, pathData);
// 		} else if (turn === 'DONE') {
// 			doTick(state);
// 		} else {
// 			const targetRoom = turn.replace('move:','');
// 			doMove(state, targetRoom);
// 		}
// 	})
// 	return state.totalReleasedPressure;
// }

// const samplePath = [
// 	'move:DD',
// 	'open',
// 	'move:CC',
// 	'move:BB',
// 	'open',
// 	'move:AA',
// 	'move:II',
// 	'move:JJ',
// 	'open',
// 	'move:II',
// 	'move:AA',
// 	'move:DD',
// 	'move:EE',
// 	'move:FF',
// 	'move:GG',
// 	'move:HH',
// 	'open',
// 	'move:GG',
// 	'move:FF',
// 	'move:EE',
// 	'open',
// 	'move:DD',
// 	'move:CC',
// 	'open',
// 	'DONE',
// 	'DONE',
// 	'DONE',
// 	'DONE',
// 	'DONE',
// 	'DONE',
// ];

const makePathDistances = (pathData) => {
	const distances = {};
	Object.keys(pathData).forEach((roomName) => {
		const results = {}; // final distances
		let distance = 1;
		let queue = pathData[roomName].tunnels;
		while (queue.length) {
			let nextNeighbors = {};
			queue.forEach((neighbor) => {
				results[neighbor] = distance;
				pathData[neighbor].tunnels.forEach((newNeighbor) => {
					nextNeighbors[newNeighbor] = true;
				})
			})
			queue = Object.keys(nextNeighbors).filter((neighbor) => {
				return !Object.keys(results).includes(neighbor)
					&& neighbor !== roomName;
			})
			distance += 1;
		}
		results[roomName] = 0;
		distances[roomName] = results;
	})
	return distances;
};

const getCurrentRoomPoints = (state, pathData, pathDistances) => {
	const roomNames = Object.keys(pathData);
	const result = {};
	roomNames.forEach((roomName) => {
		const timeRemaining = 30 - state.currMinute;
		const distanceToRoomName = pathDistances[state.currRoom][roomName];
		const hasUnopenedValve = pathData[roomName].flowRate > 0
			&& !state.openValves.includes(roomName);
		const roomValue = hasUnopenedValve
			? (timeRemaining - distanceToRoomName - 1) * pathData[roomName].flowRate
			: 0
		result[roomName] = roomValue;
	});

	return result;
};

const gotoRoomAndOpen = (state, pathData, pathDistances, targetRoom) => {
	const count = pathDistances[state.currRoom][targetRoom];
	for (let index = 0; index < count; index++) {
		doTick(state);
	}
	state.currRoom = targetRoom;
	doValve(state, pathData);
}

const puzzle = (text) => {
	let possibleStates = [{
		currMinute: 0,
		currRoom: 'AA',
		currPressureRate: 0,
		totalReleasedPressure: 0,
		openValves: [],
	}];
	let nextStates = [];
	let bestState = { totalReleasedPressure: 0};
	const pathData = makePathData(text);
	const pathDistances = makePathDistances(pathData);
	const roomNames = Object.keys(pathDistances);
	const valvable = Object.keys(pathData).filter((roomName) => {
		return pathData[roomName].flowRate > 0;
	});
	while (possibleStates.length) {
		possibleStates.forEach((state) => {
			let points = getCurrentRoomPoints(state, pathData, pathDistances);
			let targets = roomNames.filter((roomName) => {
				return points[roomName] > 0;
			})
			targets.forEach((targetRoom) => {
				const newState = JSON.parse(JSON.stringify(state));
				gotoRoomAndOpen(newState, pathData, pathDistances, targetRoom);
				nextStates.push(newState);
			})
			if (targets.length === 0) {
				const newState = JSON.parse(JSON.stringify(state));
				const waitTime = 30 - newState.currMinute;
				for (let i = 0; i < waitTime; i++) {
					doTick(newState);
				}
				nextStates.push(newState);
			}
		});
		possibleStates = [];
		nextStates.forEach((state) => {
			if (state.openValves.length === valvable.length) {
				const waitTime = 30 - state.currMinute;
				for (let i = 0; i < waitTime; i++) {
					doTick(state);
				}
			}
			if (
				state.currMinute >= 30
			) {
				if (bestState.totalReleasedPressure < state.totalReleasedPressure) {
					bestState = state;
				}
			} else {
				possibleStates.push(state);
			}
		});
		nextStates = [];
	}
	return bestState.totalReleasedPressure;
};

// console.log(me.unitTestResults(
// 	'Sample input',
// 	sampleAnswer,
// 	puzzle(sampleFileText)
// ));
console.log("real input:", puzzle(fileText)); // answer: 1737
