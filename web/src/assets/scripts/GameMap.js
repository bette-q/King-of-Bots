import { GameObject } from "./GameObject";
import { Obstacles } from "./Obstacle";

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
    this.cols = 13;

    this.obstacles = [];
    this.innerObstacles = 20;
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
        walls[y][x] ||
        (x == this.rows - 2 && y == 1) ||
        (x == 1 && y == this.cols - 2)
      ) {
        continue;
      }
      walls[x][y] = walls[y][x] = true;
      i--;
    }
    //copy
    const copyWall = JSON.parse(JSON.stringify(walls));
    //valid path between 2 snakes
    if (!this.checkConnectivity(copyWall, this.rows - 2, 1, 1, this.cols - 2)) {
      return false;
    }

    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.cols; ++c) {
        if (walls[r][c]) {
          this.obstacles.push(new Obstacles(r, c, this));
        }
      }
    }
    return true;
  }

  start() {
    for (let i = 0; i < 1000; ++i) {
      if (this.createObstacles()) break;
    }
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
  update() {
    this.updateSize();
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
