const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'sample-input.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8').trim();
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8').trim();

// started: 10:18pm
// ended: 10:28pm

const splits = fileText.split('\n');

const moves = [
	{
		move: "Rock",
		points: 1,
		alpha: "A",
		bet: "X",
		beats: "Scissors",
		target: "lose"
	},
	{
		move: "Paper",
		points: 2,
		alpha: "B",
		bet: "Y",
		beats: "Rock",
		target: "draw"
	},
	{
		move: "Scissors",
		points: 3,
		alpha: "C",
		bet: "Z",
		beats: "Paper",
		target: "win"
	},
];

const points = {
	lose: 0,
	draw: 3,
	win: 6,
};

const findMoveInfo = (move) => {
	return moves.find((item) => {
		return item.move === move;
	});
}

const evalOutcome = (alpha, bet) => {
	const opponent = moves.find((item) => {
		return item.alpha === alpha;
	});
	const target = moves.find((item) => {
		return item.bet === bet;
	}).target;
	let result = points[target];
	let yourMove = null;
	if (target === "lose") {
		yourMove = opponent.beats;
	} else if (target === "win") {
		yourMove = moves.find((item) => {
			return item.beats === opponent.move;
		}).move;
	} else if (target === "draw") {
		yourMove = opponent.move;
	}
	const yourMoveInfo = findMoveInfo(yourMove);
	return result + yourMoveInfo.points;
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
