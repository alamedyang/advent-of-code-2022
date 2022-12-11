const fs = require('fs');
const path = require('path');
const me = require('../me.js');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

const sampleAnswer = 2713310158;

// started: 10:36pm
// ended: 11:09pm

const opMap = {
	"+": (old, nu) => old + nu,
	"*": (old, nu) => old * nu,
}

const printMonkeys = (monkeys) => {
	const result = monkeys.map((monkey, index) => {
		return `Monkey ${index}: ${monkey.items.join(', ')}`;
	}).join('\n');
	console.log(result);
}

const printInspections = (monkeys) => {
	const result = monkeys.map((monkey, index) => {
		return `Monkey ${index} inspected items ${monkey} times.`;
	}).join('\n');
	console.log(result);
}

const parseMonkey = (text) => {
	const splits = text.split('\n');
	return {
		items: splits[1].trim()
			.replace('Starting items: ','')
			.split(', ')
			.map((number) => parseInt(number, 10)),
		operation: splits[2].trim()
			.replace('Operation: new = old ',''),
		test: parseInt(splits[3].trim()
			.replace('Test: divisible by ','')),
		trueTarget: parseInt(splits[4].trim()
			.replace('If true: throw to monkey ','')),
		falseTarget:parseInt( splits[5].trim()
			.replace('If false: throw to monkey ','')),
	};
}

const makeComplexMonkey = (monkey, monkeys) => {
	const modulos = monkeys.map((monkey)=>monkey.test);
	const complexItems = monkey.items.map((item) => {
		const ret = {};
		modulos.forEach((mod) => {
			ret[mod] = item % mod;
		});
		return ret;
	})
	monkey.items = complexItems;
	return monkey;
}

const puzzle = (text) => {
	let monkeys = text.split('\n\n').map((monkey) => {
		return parseMonkey(monkey);
	})
	monkeys = monkeys.map((monkey)=>makeComplexMonkey(monkey, monkeys));
	const monkeyInspectCounts = [];
	const doRound = () => {
		for (let i = 0; i < monkeys.length; i++) {
			monkeys[i].items.forEach((complexWorryItem)=>{
				const monkey = monkeys[i];
				const opSplits = monkey.operation.split(' ');
				const opDo = opMap[opSplits[0]];
				newWorryItem = {};
				Object.keys(complexWorryItem).forEach((modulo)=>{
					const opArg = opSplits[1] === 'old' ? complexWorryItem[modulo] : parseInt(opSplits[1]);
					newWorryItem[modulo] = opDo(complexWorryItem[modulo], opArg);
					newWorryItem[modulo] = newWorryItem[modulo] % modulo;
				});
				const ourWorryLevel = newWorryItem[monkey.test];
				const target = ourWorryLevel % monkey.test === 0 ? monkey.trueTarget : monkey.falseTarget;
				monkeys[target].items.push(newWorryItem);
				monkeyInspectCounts[i] = (monkeyInspectCounts[i] || 0) + 1;
			})
			monkeys[i].items = [];
		}
		// printInspections(monkeyInspectCounts);
		// printMonkeys(monkeys);
	}
	for (let i = 1; i <= 10000; i++) {
		// console.log('ROUND ' + i)
		doRound();
	}
	monkeyInspectCounts.sort((a,b) => b - a);
	return monkeyInspectCounts[0] * monkeyInspectCounts[1];
};

console.log(me.unitTestResults(
	'Sample input',
	sampleAnswer,
	puzzle(sampleFileText)
));
console.log("real input:", puzzle(fileText));
