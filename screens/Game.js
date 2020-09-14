import { AppState, Text } from "react-native";
import React, { PureComponent } from "react";

import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { get } from "lodash";

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
      get(this, "state.entities.physics.engine") ||
      Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    Matter.World.add(world);

    return {
      physics: {
        engine,
        world,
      },
    };
  }

  render() {
    const { appState, entities } = this.state;
    return (
      <GameEngine
        ref="engine"
        // systems={Systems}
        entities={entities}
        running={appState === "active"}
      ></GameEngine>
    );
  }
}

export default Game;
