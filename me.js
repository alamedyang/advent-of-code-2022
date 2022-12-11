const me = {};

/* ---------- SETS AND MAPS ---------- */

me.mapStringChars = (string) => {
	const map = {};
	string.split('').forEach((char) => {
		map[char] = (map[char] || 0) + 1;
	})
	return map;
};
me.mapArrayItems = (array) => {
	const map = {};
	array.forEach((item) => {
		map[item] = (map[item] || 0) + 1;
	});
	return map;
};
me.mapNumberRange = (start, end) => {
	const map = {};
	for (let i = start; i <= end; i++) {
		map[i] = 1;
	}
	return map;
};

me.getUniqueArrayItems = (array) => {
	const map = me.mapArrayItems(array);
	return Object.keys(map);
};

me.overlappingArrayItems = function () {
	const arrays = [...arguments];
	let map = me.mapArrayItems(arrays.splice(0,1)[0]);
	while (arrays.length) {
		const overlaps = {};
		arrays.splice(0,1)[0].forEach((item) => {
			if (map[item]) {
				overlaps[item] = true;
			}
		});
		map = overlaps;
	}
	return Object.keys(map);
};
me.mapContainsMap = (largeMap, smallMap) => {
	const overlaps = me.overlappingArrayItems(
		Object.keys(largeMap),
		Object.keys(smallMap),
	);
	return overlaps.length === Object.keys(smallMap).length;
};
me.arrayContainsArray = (largeArray, smallArray) => {
	const overlaps = me.overlappingArrayItems(
		largeArray,
		smallArray,
	);
	return overlaps.length === smallArray.length;
};

/* ---------- GRIDS ---------- */

me.makeBlankGrid = (width, height, fillChar) => {
	const char = fillChar ? fillChar : '.';
	const row = [];
	row.length = width;
	row.fill(char);
	const rows = [];
	for (let i = 0; i <= height; i++) {
		rows.push(row.slice());
	}
	return rows;
};

me.fuseGrid = (grid) => {
	return grid.map((row) => {
		return row.join('');
	}).join('\n');
};

me.drawUnanchoredCoords = (coordsArray) => {
	let coords = Array.isArray(coordsArray[0])
		? coordsArray.map((coords) => {
			return {
				x: coords[0],
				y: coords[1],
				char: '#'
			}
		})
		: coordsArray;
	const minX = coords.map((coords)=>coords.x).reduce((prev,cur)=>Math.min(prev,cur),Infinity);
	const maxX = coords.map((coords)=>coords.x).reduce((prev,cur)=>Math.max(prev,cur),-Infinity);
	const minY = coords.map((coords)=>coords.y).reduce((prev,cur)=>Math.min(prev,cur),Infinity);
	const maxY = coords.map((coords)=>coords.y).reduce((prev,cur)=>Math.max(prev,cur),-Infinity);
	const sizeX = maxX - minX;
	const sizeY = maxY - minY;
	const grid = me.makeNewGrid(sizeX, sizeY, '.');
	const plotChar = (x,y,char) => {
		const realX = x - minX;
		const realY = y - minY;
		grid[realY][realX] = char;
	}
	coords.forEach((coord) => {
		plotChar(
			coord.x,
			coord.y,
			coord.char || '#'
		);
	})
	const drawableGrid = grid.reverse();
	console.log(me.fuseGrid(drawableGrid));
	return me.fuseGrid(drawableGrid);
};

/* ---------- UNIT TEST-ISH ---------- */

const ansi = {
	red: '\u001B[31;1m', // +bold
	green: '\u001B[32;1m', // +bold
	blue: '\u001B[34;1m', // +bold
	white: '\u001B[37m',
	clear: '\u001B[0m',
};
me.ansi = ansi;

me.styleText = (text, color) => {
	// quickie
	return `${ansi[color]}${text}${ansi.clear}`
};
me.unitTestResults = (testName, expected, received) => {
	const color = expected === received ? ansi.green : ansi.red;
	let message = `${ansi.white}${testName}: ${color}${received}`;
	if (expected !== received) {
		message += ` ${ansi.clear}${ansi.white}(expected: ${expected})${ansi.clear}`;
	}
	return message += ansi.clear;
};

module.exports = me;
