import { GameObject } from "./GameObject";

export class Obstacles extends GameObject {
  constructor(r, c, gamemap) {
    super();

    this.r = r;
    this.c = c;
    this.gamemap = gamemap;
    this.color = "#b37226";
  }

  update() {
    this.render();
  }

  render() {
    const unitSize = this.gamemap.unitSize;
    const ctx = this.gamemap.ctx;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.c * unitSize, this.r * unitSize, unitSize, unitSize);
  }
}
