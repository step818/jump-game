import { Dimensions } from "react-native";
import Matter from "matter-js";

const { width, height } = Dimensions.get("window");

const Physics = (entities, { time }) => {
  const { engine } = entities.physics;
  engine.world.gravity.y = 0.4;
  Matter.Engine.update(engine, time.delta);
  return entities;
};

export { Physics };
