const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 1651;

const makePathData = (text) => {
	const pathData = {};
	text.split('\n').forEach((line)=>{
		const cleanLine = line
			.replace('Valve ','')
			.replace(' has flow rate=','|')
			.replace('valves ','valve ')
			.replace('tunnels ','tunnel ')
			.replace('lead ','leads ')
			.replace('; tunnel leads to valve ','|')
			.split('|');
		pathData[cleanLine[0]] = {
			flowRate: parseInt(cleanLine[1],10),
			tunnels: cleanLine[2].split(', ')
		}
	})
	Object.keys(pathData).forEach((roomName) => {
		// distance for this room to its neighbors
		const results = {};
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
		pathData[roomName].distances = results;
		// while we're here, calculate the lifetime points if turned on in a specific minute
		const lifetimePoints = [ 0 ];
		for (let i = 1; i <= 30; i++) {
			lifetimePoints[i] = pathData[roomName].flowRate * (30 - i) || 0;
		}
		pathData[roomName].lifetimePoints = lifetimePoints;
	})
	return pathData;
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
	state.potentialValves = state.potentialValves.filter((item)=>item!==state.currRoom);
	state.currPressureRate += paths[state.currRoom].flowRate;
};

const getCurrentRoomPoints = (state, pathData) => {
	const result = {};
	Object.keys(pathData).forEach((roomName) => {
		const distanceToRoomName = pathData[state.currRoom].distances[roomName];
		const hasUnopenedValve = pathData[roomName].flowRate > 0
			&& state.potentialValves.includes(roomName);
		const soonestMinuteCanOpen = state.currMinute + distanceToRoomName + 1;
		const roomPoints = hasUnopenedValve
			? pathData[roomName].lifetimePoints[soonestMinuteCanOpen]
			: 0;
		if (roomPoints > 0) {
			result[roomName] = roomPoints;
		}
	});
	return result;
};

const gotoRoomAndOpen = (state, pathData, targetRoom) => {
	const count = pathData[state.currRoom].distances[targetRoom];
	for (let index = 0; index < count; index++) {
		doTick(state);
	}
	state.currRoom = targetRoom;
	doValve(state, pathData);
};

const scrunchState = (report, state) => {
	const pathsString = state.openValves.slice().sort().join(',');
	const statePressure = state.totalReleasedPressure;
	if (
		report[pathsString] === undefined
		|| report[pathsString] < statePressure
	) {
		report[pathsString] = statePressure;
	}
};

const puzzle = (text) => {
	const pathData = makePathData(text);
	let possibleStates = [{
		currMinute: 0,
		currRoom: 'AA',
		currPressureRate: 0,
		totalReleasedPressure: 0,
		openValves: [],
		potentialValves: Object.keys(pathData).filter((roomName) => {
			return pathData[roomName].flowRate > 0;
		}),
	}];
	const valvable = possibleStates[0].potentialValves;
	let nextStates = [];
	const scrunched = {};
	let bestState = { totalReleasedPressure: 0};
	while (possibleStates.length) {
		possibleStates.forEach((state) => {
			let points = getCurrentRoomPoints(state, pathData);
			let targets = Object.keys(points).filter((roomName) => {
				return points[roomName] > 0;
			})
			targets.forEach((targetRoom) => {
				const newState = JSON.parse(JSON.stringify(state));
				gotoRoomAndOpen(newState, pathData, targetRoom);
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
				scrunchState(scrunched,state);
				if (bestState.totalReleasedPressure < state.totalReleasedPressure) {
					bestState = state;
				}
			} else {
				possibleStates.push(state);
			}
		});
		nextStates = [];
	}
	const top = Object.values(scrunched).sort((a,b)=>b-a)[0];
	return top;
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log(me.unitTestResults(
	'Real input',
	1737,
	puzzle(fileText)
));
