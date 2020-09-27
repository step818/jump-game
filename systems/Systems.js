import { Dimensions } from "react-native";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  engine.world.gravity.y = 0.4;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Jump = (state, entities) => {
  const { frog, ...platforms } = state;
  console.log(frog);
  console.log(platforms);
  plats = [];
  for (item in platforms) {
    // filter the non platforms out from being pushed in to plats array
    // if(item is a platform){
    // plats.push(item)}
  }
  // const platforms = Object.values(entities).filter(
  // (item) => item.body && item.body.label === "platform"
  // );
  // now get the frogbottom and platform top and create a jomping force, even just a little one. or makd the platform change colors or somtehing easy
  const frogBottom = frog.body.bounds.min.y;

  if (
    Math.abs(plat.body.bounds.max.y - frogBottom) < -frog.body.velocity.y &&
    plat.body.bounds.max.y < frog.body.bounds.min.y
  ) {
    console.log("hello from jump systems");
  }
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

export { Physics, Tilt, Jump };
