const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: launch!
// ended: 10:17pm

const splits = fileText.split('\n');

const moves = [
	{
		move: "Rock",
		points: "1",
		alpha: "A",
		bet: "X",
		beats: "Scissors"
	},
	{
		move: "Paper",
		points: "2",
		alpha: "B",
		bet: "Y",
		beats: "Rock"
	},
	{
		move: "Scissors",
		points: "3",
		alpha: "C",
		bet: "Z",
		beats: "Paper"
	},
];

const points = {
	lose: 0,
	draw: 3,
	win: 6,
};

const evalOutcome = (alpha, bet) => {
	const opponent = moves.find((item) => {
		return item.alpha === alpha;
	});
	const you = moves.find((item) => {
		return item.bet === bet;
	});
	let result = null;
	if (you.beats === opponent.move) {
		result = points.win;
	} else if (you.move === opponent.move) {
		result = points.draw;
	} else if (opponent.beats === you.move) {
		result = points.lose;
	} else {
		throw new Error("You done goofed something!");
	}
	return parseInt(result, 10) + parseInt(you.points, 10);
};

const scores = splits.map((move) => {
	const moveSplits = move.split(' ');
	const result = evalOutcome(moveSplits[0], moveSplits[1]);
	return result;
});

console.log(scores)

const result = scores.reduce(
	(prev, cur) => prev + cur,
	0
);

console.log(result);

console.log('breakpoint lol');
