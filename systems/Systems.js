import { Dimensions } from "react-native";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  engine.world.gravity.y = 0.4;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

const Trajectory = (entities) => {
  // const { frog, ...platforms } = state;
  const platforms = Object.values(entities).filter(
    (item) => item.body && item.body.label === "platform"
  );
  const frog = Object.values(entities).filter(
    (item) => item.body && item.body.label === "frog"
  );
  console.log(frog[0].body.position.y);
  const frogBottom = frog[0].body.position.y;
  // console.log("frogBottom: " + frogBottom);
  console.log(frog[0].body.velocity.y);
  const frogVelocity = frog[0].body.velocity.y;
  platforms.forEach((item) => {
    if (frogBottom < 460) {
      console.log(item);
    }
  });

  console.log(entities);
  let plats = [];
  // for (let item in platforms) {
  // filter the non platforms out from being pushed in to plats array
  // if(item is a platform){
  // plats.push(item)}
  // }
  // const platforms = Object.values(entities).filter(
  // (item) => item.body && item.body.label === "platform"
  // );
  // now get the frogbottom and platform top and create a jomping force, even just a little one. or makd the platform change colors or somtehing easy
  // const frogBottom = frog.body.bounds.min.y;

  // if (
  //   Math.abs(plat.body.bounds.max.y - frogBottom) < -frog.body.velocity.y &&
  //   plat.body.bounds.max.y < frog.body.bounds.min.y
  // ) {
  //   console.log("hello from jump systems");
  // }
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

export { Physics, Tilt, Trajectory };
