//super class for real time rendering
const GAME_OBJECTS = [];

export class GameObject {
  constructor() {
    //components are stacked according to the order in array
    GAME_OBJECTS.push(this);
    //measures speed of object?
    this.timeDelta = 0;
    this.calledStart = false;
  }
  //only execute once
  start() {}

  //execute at each frame following start
  update() {}

  //execute before destroy
  onDestroy() {}
  destroy() {
    this.onDestroy();

    for (let i in GAME_OBJECTS) {
      const obj = GAME_OBJECTS[i];
      if (obj == this) {
        GAME_OBJECTS.splice(i);
        break;
      }
    }
  }
}

let lastTimestamp;
//every refresh after the first
const step = (timestamp) => {
  for (let obj of GAME_OBJECTS) {
    if (!obj.calledStart) {
      obj.calledStart = true;
      obj.start();
    } else {
      obj.timeDelta = timestamp - lastTimestamp;
      obj.update();
    }
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(step);
};
//initial frame
requestAnimationFrame(step);
