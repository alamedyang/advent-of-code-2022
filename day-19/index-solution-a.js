const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch
// ended: 1:57am (some delays)

const minutes = 24;

const processInput = (text) => {
	return text.split('\n')
		.map((line) => {
			const splits = line
				.replaceAll('Blueprint ','')
				.replaceAll(': Each ore robot costs ','|')
				.replaceAll(' ore. Each clay robot costs ','|')
				.replaceAll(' ore. Each obsidian robot costs ','|')
				.replaceAll(' ore and ','|')
				.replaceAll(' clay. Each geode robot costs ','|')
				.replaceAll(' ore and ','|')
				.replaceAll(' obsidian.','')
				.split('|');
			return {
				blueprint: parseInt(splits[0],10),
				robots: {
					ore: {
						robotType: 'ore',
						costs: {
							ore: parseInt(splits[1],10)
						}
					},
					clay: {
						robotType: 'clay',
						costs: {
							ore: parseInt(splits[2],10)
						}
					},
					obsidian: {
						robotType: 'obsidian',
						costs: {
							ore: parseInt(splits[3],10),
							clay: parseInt(splits[4],10),
						}
					},
					geode: {
						robotType: 'geode',
						costs: {
							ore: parseInt(splits[5],10),
							obsidian: parseInt(splits[6],10),
						}
					},
				},
			}
		});
};

const getAffordableRobots = (state, blueprints) => {
	return Object.keys(blueprints.robots).filter((robotType) => {
		const info = blueprints.robots[robotType];
		const resourcesNeeded = Object.keys(info.costs);
		const affordableResources = resourcesNeeded.filter((resource) => {
			return state.resources[resource] >= info.costs[resource];
		});
		return resourcesNeeded.length === affordableResources.length;
	})
};

const doIncome = (state) => {
	Object.keys(state.robots).forEach((robotType) => {
		const robotQty = state.robots[robotType];
		state.resources[robotType] += robotQty;
	})
};

const buyRobot = (state, blueprints, robotType) => {
	const robotCosts = blueprints.robots[robotType].costs;
	Object.keys(robotCosts).forEach((resource) => {
		const qty = robotCosts[resource];
		state.resources[resource] -= qty;
	})
	state.robots[robotType] += 1;
};

const doMove = (state, blueprints, move) => {
	doIncome(state);
	if (move !== 'WAIT' && move !== undefined) {
		buyRobot(state, blueprints, move);
	}
	state.minute += 1;
};

const getBestStateFromBlueprints = (blueprints) => {
	let states = [{
		minute: 0,
		resources: {
			clay: 0,
			geode: 0,
			obsidian: 0,
			ore: 0,
		},
		robots: {
			clay: 0,
			geode: 0,
			obsidian: 0,
			ore: 1,
		}
	}];
	let potentialStates = [];
	let awaitStates = [];
	let doneStates = [];
	let bestGeode = 0;
	const addToDone = (state) => {
		if (state.resources.geode > bestGeode) {
			doneStates = [ state ];
			bestGeode = state.resources.geode;
		} else if (state.resources.geode === bestGeode){
			doneStates.push(state);
		}
		// discard the rest
	}
	const oreCap = Object.values(blueprints.robots)
		.map((robot) => robot.costs.ore || 0)
		.reduce((prev,cur)=>Math.max(prev, cur),0);
	const robotTypes = Object.keys(states[0].robots);
	while (states.length) {
		states.sort((a, b) => b.minute - a.minute);
		states.forEach((state) => {
			// minute 21
			// robots: 1x ore, 4x clay, 2x obsidian, 1x geode
			// resources: 3x ore, 29x clay, 2x obsidian, 2x geodes
			robotTypes.forEach((robotType) => {
				const newState = JSON.parse(JSON.stringify(state));
				const noIncome = Object.keys(blueprints.robots[robotType].costs)
					.filter((resource) => state.robots[resource] === 0 );
				if (noIncome.length) { // we're missing income for one of its resources
					// we can't buy it
				} else if (robotType === 'ore' && state.robots.ore >= oreCap) {
					// don't try to buy any more
				} else if (!getAffordableRobots(newState, blueprints).includes(robotType)) {
					const timeCapsuleState = JSON.parse(JSON.stringify(newState));
					while (!getAffordableRobots(newState, blueprints).includes(robotType)) {
						doMove(newState, blueprints, 'WAIT');
					}
					doMove(newState, blueprints, robotType);
					if (newState.minute > minutes) {
						awaitStates.push(timeCapsuleState);
					} else if (newState.minute === minutes) {
						addToDone(newState);
					} else {
						potentialStates.push(newState);
					}
				} else {
					doMove(newState, blueprints, robotType);
					if (newState.minute >= minutes) {
						addToDone(newState);
					} else {
						potentialStates.push(newState);
					}
				}
			})
		})
		states = potentialStates
		potentialStates = [];
		awaitStates.forEach((state) => {
			while (state.minute < minutes) {
				doMove(state, blueprints, 'WAIT');
			}
			addToDone(state);
		})
		awaitStates = [];
	}
	return bestGeode;
};

const puzzle = (text) => {
	const blueprintCatalog = processInput(text);
	const scores = blueprintCatalog.map(getBestStateFromBlueprints)
		.map((score,index) => {
			const number = index + 1;
			return score * number;
		})
	return scores.reduce((prev,cur)=>prev+cur, 0);
};

console.log(me.unitTestResults(
	'Sample input',
	33,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
