import { GameObject } from "./GameObject";
import { Cell } from "./Cell";

export class Snake extends GameObject {
  constructor(info, gamemap) {
    super();

    this.id = info.id;
    this.color = info.color;
    this.gamemap = gamemap;

    this.cells = [new Cell(info.r, info.c)]; //body of snake, cells[0] -> head
    this.nextCell = null;

    this.speed = 5; //# of cells per second
    this.direction = -1; //-1 -> no input, 0, 1, 2, 3 -> up, down, left, right
    this.status = "idle"; //idle, move, died

    this.dirs = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    this.round = 0;
    this.eps = 1e-2; //error bound from point a to point b

    this.eyeDirection = this.id;
    //[left, right]
    this.eyeDx = [
      //x offset
      [-1, 1],
      [1, -1],
      [-1, -1],
      [1, 1],
    ];
    this.eyeDy = [
      //y offset
      [-1, -1],
      [1, 1],
      [1, -1],
      [-1, 1],
    ];
  }

  start() {}

  //allows input from different sources
  setDirection(d) {
    this.direction = d;
  }

  //check if snake length increase at current round
  checkIncreasingLength() {
    //after 10 rounds, increase length every 3 rounds
    if (this.round <= 10 || this.round % 3 === 1) return true;
    return false;
  }

  //make next move
  nextStep() {
    const d = this.direction;
    this.nextCell = new Cell(
      this.cells[0].r + this.dirs[d][0],
      this.cells[0].c + this.dirs[d][1]
    );
    this.eyeDirection = d;
    this.direction = -1; //reset
    this.status = "move";
    this.round++;

    const k = this.cells.length;
    for (let i = k; i > 0; --i) {
      //create space for new head
      this.cells[i] = JSON.parse(JSON.stringify(this.cells[i - 1]));
    }

    if (!this.gamemap.checkValid(this.nextCell)) {
      this.status = "died";
    }
  }

  //move the head
  updateMove() {
    const dx = this.nextCell.x - this.cells[0].x;
    const dy = this.nextCell.y - this.cells[0].y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    //reached dest
    if (distance < this.eps) {
      this.cells[0] = this.nextCell;
      this.nextCell = null;
      this.status = "idle";

      if (!this.checkIncreasingLength()) {
        this.cells.pop();
      }
    } else {
      //creates moving animation
      const moveDistance = (this.speed * this.timeDelta) / 1000; //distance moved between every 2 frames
      this.cells[0].x += (moveDistance * dx) / distance;
      this.cells[0].y += (moveDistance * dy) / distance;

      //move tail forward
      if (!this.checkIncreasingLength()) {
        const k = this.cells.length;

        const tail = this.cells[k - 1];
        const target = this.cells[k - 2];
        const tailDx = target.x - tail.x;
        const tailDy = target.y - tail.y;
        tail.x += (moveDistance * tailDx) / distance;
        tail.y += (moveDistance * tailDy) / distance;
      }
    }
  }

  //called every frame
  update() {
    if (this.status === "move") {
      this.updateMove();
    }
    this.render();
  }

  render() {
    const unitSize = this.gamemap.unitSize;
    const ctx = this.gamemap.ctx;

    ctx.fillStyle = this.color;
    if (this.status === "died") {
      ctx.fillStyle = "gray";
    }

    for (const cell of this.cells) {
      ctx.beginPath();
      ctx.arc(
        cell.x * unitSize,
        cell.y * unitSize,
        (unitSize / 2) * 0.8,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    //fill gaps between circles
    for (let i = 1; i < this.cells.length; ++i) {
      const a = this.cells[i - 1],
        b = this.cells[i];
      const xDiff = Math.abs(a.x - b.x);
      const yDiff = Math.abs(a.y - b.y);

      //no diff
      if (xDiff < this.eps && yDiff < this.eps) {
        continue;
      }

      if (xDiff < this.eps) {
        //same x-axis
        ctx.fillRect(
          (a.x - 0.4) * unitSize,
          Math.min(a.y, b.y) * unitSize,
          unitSize * 0.8,
          yDiff * unitSize
        );
      } else {
        //same y-axis
        ctx.fillRect(
          Math.min(a.x, b.x) * unitSize,
          Math.abs(a.y - 0.4) * unitSize,
          xDiff * unitSize,
          unitSize * 0.8
        );
      }
    }

    //eyes
    ctx.fillStyle = "white";
    for (let i = 0; i < 2; ++i) {
      const eyeX =
        (this.cells[0].x + this.eyeDx[this.eyeDirection][i] * 0.15) * unitSize;
      const eyeY =
        (this.cells[0].y + this.eyeDy[this.eyeDirection][i] * 0.15) * unitSize;
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, unitSize * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
