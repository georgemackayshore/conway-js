const CELL_SIZE = 5; // px
const GRID_COLOUR = "#CCCCCC";
const DEAD_COLOUR = "#FFFFFF";
const LIVE_COLOUR = "#000000";

const width = 64;
const height = 64;
const canvasWidth = (CELL_SIZE + 1) * width + 1;
const canvasHeight = (CELL_SIZE + 1) * height + 1;

let cells = [];

const canvas = document.getElementById("game-of-life-canvas");
canvas.height = canvasHeight;
canvas.width = canvasWidth;

const ctx = canvas.getContext("2d");

const cellIndex = (row, col) => row * width + col;

const liveNeighbourCount = (row, col) => {
  let count = 0;
  for (let deltaRow = height - 1; deltaRow <= height + 1; deltaRow++) {
    for (let deltaCol = width - 1; deltaCol <= width + 1; deltaCol++) {
      if (deltaRow === height && deltaCol === width) continue;

      const neighbourRow = (row + deltaRow) % height;
      const neighbourCol = (col + deltaCol) % width;
      const i = cellIndex(neighbourRow, neighbourCol);
      if (cells[i]) {
        count++;
      }
    }
  }
  return count;
}

const tick = () => {
  const next = [];

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const i = cellIndex(row, col);
      const cell = cells[i];
      const liveNeighbours = liveNeighbourCount(row, col);

      let nextCell;
      if (cell) {
        if (liveNeighbours < 2) {
          // Rule 1
          nextCell = false;
        } else if (liveNeighbours === 2 || liveNeighbours === 3) {
          // Rule 2
          nextCell = true;
        } else if (liveNeighbours > 3) {
          // Rule 3
          nextCell = false;
        }
      } else if (liveNeighbours === 3) {
        // Rule 4
        nextCell = true;
      } else {
        // Otherwise, stay the same
        nextCell = cell;
      }

      next.push(nextCell);
    }
  }

  cells = Array.from(next);
}

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOUR;

  for (let i = 0; i <= width; i++) {
    const x = i * (CELL_SIZE + 1) + 1;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
  }

  for (let j = 0; j <= height; j++) {
    const y = j * (CELL_SIZE + 1) + 1;
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
  }

  ctx.stroke();
};

const drawCells = () => {
  ctx.beginPath();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const i = cellIndex(row, col);

      ctx.fillStyle = cells[i] ? LIVE_COLOUR : DEAD_COLOUR;
      ctx.fillRect(col * (CELL_SIZE + 1) + 1, row * (CELL_SIZE + 1) + 1, CELL_SIZE, CELL_SIZE);
    }
  }

  ctx.stroke();
}

const renderLoop = () => {
  tick();

  drawGrid();
  drawCells();

  requestAnimationFrame(renderLoop);
}


const totalCells = width * height;
for (let i = 0; i < totalCells; i++) {
  cells.push((i % 2 === 0) || (i % 7 ===0));
}

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);
