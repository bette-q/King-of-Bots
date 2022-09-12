import { GameObject } from "./GameObject";
import { Obstacles } from "./Obstacle";
import { Snake } from "./Snake";

export class GameMap extends GameObject {
  constructor(ctx, parent) {
    super();

    //canvas
    this.ctx = ctx;
    //game map container
    this.parent = parent;
    //absolute size of a single unit
    this.unitSize = 0;

    //size of map(square)
    this.rows = 13;
    this.cols = 14;

    this.obstacles = [];
    this.innerObstacles = 20;

    this.snakes = [
      new Snake({ id: 0, color: "#4876EC", r: this.rows - 2, c: 1 }, this),
      new Snake({ id: 1, color: "#F94848", r: 1, c: this.cols - 2 }, this),
    ];
  }

  //check valid path between 2 snakes
  checkConnectivity(wall, sx, sy, tx, ty) {
    if (sx == tx && sy == ty) {
      return true;
    }
    wall[sx][sy] = true;

    let dx = [-1, 0, 1, 0],
      dy = [0, 1, 0, -1];

    for (let i = 0; i < 4; ++i) {
      let x = sx + dx[i],
        y = sy + dy[i];
      if (!wall[x][y] && this.checkConnectivity(wall, x, y, tx, ty)) {
        return true;
      }
    }
    return false;
  }

  createObstacles() {
    //mark obstacle location
    const walls = [];
    //initialzation
    for (let r = 0; r < this.rows; ++r) {
      walls[r] = [];
      for (let c = 0; c < this.cols; ++c) {
        if (c == 0 || c == this.cols - 1 || r == 0 || r == this.rows - 1) {
          //setting the outer boundary
          walls[r][c] = true;
        } else {
          walls[r][c] = false;
        }
      }
    }

    //placing random obstacles inside the boundary
    let i = Math.trunc(this.innerObstacles / 2);
    while (i > 0) {
      let random = Math.trunc(Math.random() * (this.rows * this.cols - 1));
      let x = Math.trunc(random / this.cols);
      let y = Math.trunc(random % this.cols);
      //no placement at dup or starting position of snake(bottom left & top right )
      if (
        walls[x][y] ||
        walls[this.rows - 1 - x][this.cols - 1 - y] ||
        (x == this.rows - 2 && y == 1) ||
        (x == 1 && y == this.cols - 2)
      ) {
        continue;
      }
      //point symmetry
      walls[x][y] = walls[this.rows - 1 - x][this.cols - 1 - y] = true;
      i--;
    }
    //copy array: js -> json -> js
    const copyWall = JSON.parse(JSON.stringify(walls));
    //valid path between 2 snakes
    if (!this.checkConnectivity(copyWall, this.rows - 2, 1, 1, this.cols - 2)) {
      return false;
    }

    //adding obstacles component
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.cols; ++c) {
        if (walls[r][c]) {
          this.obstacles.push(new Obstacles(r, c, this));
        }
      }
    }
    return true;
  }

  //keyboard control
  addListeningEvents() {
    this.ctx.canvas.focus();

    const [snake0, snake1] = this.snakes;
    this.ctx.canvas.addEventListener("keydown", (e) => {
      const key = e.key;
      switch (key) {
        case "w":
          snake0.setDirection(0);
          break;
        case "s":
          snake0.setDirection(1);
          break;
        case "a":
          snake0.setDirection(2);
          break;
        case "d":
          snake0.setDirection(3);
          break;
        case "ArrowUp":
          snake1.setDirection(0);
          break;
        case "ArrowDown":
          snake1.setDirection(1);
          break;
        case "ArrowLeft":
          snake1.setDirection(2);
          break;
        case "ArrowRight":
          snake1.setDirection(3);
          break;
        default:
          break;
      }
    });
  }
  start() {
    for (let i = 0; i < 1000; ++i) {
      if (this.createObstacles()) break;
    }
    this.addListeningEvents();
  }

  updateSize() {
    //max size of unit in a square that can fit into playground
    this.unitSize = Math.trunc(
      Math.min(
        this.parent.clientWidth / this.cols,
        this.parent.clientHeight / this.rows
      )
    );
    this.ctx.canvas.width = this.unitSize * this.cols;
    this.ctx.canvas.height = this.unitSize * this.rows;
  }

  //check if snake is ready for next move
  checkReady() {
    for (const snake of this.snakes) {
      if (snake.direction === -1 || snake.status !== "idle") return false;
    }
    return true;
  }

  //next move
  nextStep() {
    for (const snake of this.snakes) {
      snake.nextStep();
    }
  }

  //check if next move is safe -> avoid wall and snake body
  checkValid(cell) {
    for (const wall of this.obstacles) {
      if (wall.r === cell.r && wall.c === cell.c) {
        return false;
      }
    }

    for (const snake of this.snakes) {
      let k = snake.cells.length;

      //check if the head will move into the tail
      if (!snake.checkIncreasingLength()) {
        k--;
      }

      for (let i = 0; i < k; ++i) {
        if (snake.cells[i].r === cell.r && snake.cells[i].c === cell.c) {
          return false;
        }
      }
    }
    return true;
  }

  update() {
    this.updateSize();
    if (this.checkReady()) {
      this.nextStep();
    }
    this.render();
  }

  render() {
    const colorEven = "#AAD751",
      colorOdd = "#8fc12c";

    //alternating color on grid
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.cols; ++c) {
        if ((r + c) % 2 == 0) {
          this.ctx.fillStyle = colorEven;
        } else {
          this.ctx.fillStyle = colorOdd;
        }
        this.ctx.fillRect(
          c * this.unitSize,
          r * this.unitSize,
          this.unitSize,
          this.unitSize
        );
      }
    }
  }
}
