// Functions I wasted a lot of time on but didn't use to win

// VEEEEEEEE

const veeCharMap = {
	"1,0": ">",
	"-1,0": "<",
	"0,1": "V",
	"0,-1": "^",
};
const getVeeChar = (coord1, coord2) => {
	const diffX = coord2.x - coord1.x;
	const diffY = coord2.y - coord1.y;
	const combo = diffX + "," + diffY;
	return veeCharMap[combo];
}
const makeVeeGrid = (grid) => {
	const veeGrid = me.makeBlankGrid(
		grid[0].length,
		grid.length,
		" "
	);
	const endCoords = getCoordsWithValue('E', grid)[0];
	grid.forEach((row, rowIndex) => {
		row.forEach((currValue, colIndex) => {
			const neighbors = getNeighborCoordsFromGrid({x:colIndex,y:rowIndex}, grid);
			neighbors.forEach((neighbor) => {
				const neighborValue = grid[neighbor.y][neighbor.x];
				const diff = compareChars(currValue,neighborValue);
				if (diff === 1) {
					const char = getVeeChar({x:colIndex,y:rowIndex},neighbor);
					veeGrid[rowIndex][colIndex] = char;
				}
			})
		});
	});
	veeGrid[endCoords.y][endCoords.x] = 'E';
	return veeGrid;
};

const findContiguousValues = (coords, grid) => {
	const contig = [];
	const checked = {};
	let coordsToCheck = [ coords ];
	let coordsToCheckNext = [];
	const targetValue = grid[coords.y][coords.x]
		.replace('S','a').replace('E','z');
	while (coordsToCheck.length) {
		coordsToCheck.forEach((coords)=>{
			const neighbors = getNeighborCoordsFromGrid(coords, grid)
				.filter((neighbor) => {
					return !checked[neighbor.x + ',' + neighbor.y];
				});
			neighbors.forEach((neighbor) => {
				checked[neighbor.x + ',' + neighbor.y] = true;
				const neighborValue = grid[neighbor.y][neighbor.x]; 
				if (neighborValue === targetValue) {
					contig.push(neighbor);
					coordsToCheckNext.push(neighbor);
				}
			})
		})
		coordsToCheck = coordsToCheckNext;
		coordsToCheckNext = [];
	}
	return contig;
}

const findNeighborsOfContiguous = (coordArray, grid) => {
	const crawled = {};
	coordArray.forEach((coord) => {
		crawled[coord.x + ',' + coord.y] = true;
	})
	let result = [];
	coordArray.forEach((coord) => {
		const neighbors = getNeighborCoordsFromGrid(coord, grid)
			.filter((coord) => {
				return !crawled[coord.x + ',' + coord.y];
			});
			neighbors.forEach((neighbor) => {
				crawled[coord.x + ',' + coord.y] = true;
				result.push(neighbor);
			})
	})
	return result;
};
