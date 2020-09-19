import { AppState, Dimensions, Text, TextPropTypes } from "react-native";
import { Floor, Frog } from "../renderers/renderers.js";
import React, { PureComponent } from "react";
import { fromPairs, get } from "lodash";

import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Physics } from "../systems/Systems.js";

const { width, height } = Dimensions.get("window");

class Game extends PureComponent {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super();
    this.state = this.initState;
  }

  get initState() {
    return {
      appState: "active",
      entities: this.entities,
    };
  }
  get entities() {
    const engine =
      get(this, "state.entities.physics.engine") || Matter.Engine.create();
    const world = engine.world;

    const frog = Matter.Bodies.rectangle(width / 2, height - 350, 25, 25, {
      label: "frog",
      friction: 0.1,
    });
    const { platforms, bodies } = this.platforms;
    const floor = Matter.Bodies.rectangle(width / 2, height - 10, width, 100, {
      isStatic: true,
      friction: 0.1,
      // isSensor: true,
      label: "floor",
    });
    Matter.World.add(world, [frog, floor]);

    return {
      physics: {
        engine,
        world,
      },
      frog: {
        body: frog,
        size: [25, 25],
        renderer: Frog,
      },
      ...platforms,
      floor: {
        body: floor,
        size: [width + 100, 100],
        renderer: Floor,
      },
    };
  }

  collisionHandler = (engine) => {
    Matter.Events.on(engine, "collisionStart", (event) => {
      const { pairs } = event;
      const objA = pairs[0].bodyA.label;
      const objB = pairs[1].bodyB.label;
    });
  };

  get platforms() {
    const platforms = {};
    const bodies = [];
  }

  render() {
    const { appState, entities } = this.state;
    return (
      <GameEngine
        ref="engine"
        systems={[Physics]}
        entities={entities}
        running={appState === "active"}
      ></GameEngine>
    );
  }
}

export default Game;
