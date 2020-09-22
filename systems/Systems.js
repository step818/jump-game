import { Dimensions } from "react-native";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  engine.world.gravity.y = 0.4;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Tilt = (state) => {
  const { frog } = state;
  const xTilt = frog.body.xtilt;
  let xPos = frog.body.position.x;

  if (xPos >= width - 13 && xTilt > 0) {
    xPos = width - 13;
  } else if (xPos <= 13 && xTilt < 0) {
    xPos = 13;
  } else {
    xPos += xTilt * 20;
  }

  Matter.Body.setPosition(frog.body, {
    x: xPos,
    y: frog.body.position.y,
  });
  return state;
};

export { Physics, Tilt };
