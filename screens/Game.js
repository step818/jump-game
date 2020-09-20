import { AppState, Dimensions, Text, TextPropTypes } from "react-native";
import { Floor, Frog, Platform } from "../renderers/renderers.js";
import { Physics, Tilt } from "../systems/Systems.js";
import React, { PureComponent } from "react";

import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { get } from "lodash";
import randomInt from "random-int";

const { width, height } = Dimensions.get("window");

let COUNTER = 1;

class Game extends PureComponent {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super();
    this.state = this.initState;
  }

  componentDidMount() {
    this._subscription = Accelerometer.addListener(({ x }) => {
      Matter.Body.set(this.refs.engine.state.entities.frog.body, {
        xtilt: x,
      });
    });

    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentWillUnmount() {
    this._subscription && this._subscription.remove();
    this._subscription = null;
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
  };

  get initState() {
    return {
      appState: "active",
      entities: this.entities,
    };
  }
  //create the characters and props dimensions and properties
  get entities() {
    const engine =
      get(this, "state.entities.physics.engine") || Matter.Engine.create();
    const world = engine.world;

    const frog = Matter.Bodies.rectangle(width / 2, height - 350, 25, 25, {
      label: "frog",
      friction: 0.1,
      restitution: 1,
      inertia: Infinity,
      xtilt: 0,
    });
    const platform_0 = Matter.Bodies.rectangle(
      width / 2,
      height - 100,
      25,
      10,
      {
        isStatic: true,
        restitution: 1,
        label: "platform",
      }
    );
    const { platforms, bodies } = this.platforms;
    const floor = Matter.Bodies.rectangle(width / 2, height - 10, width, 100, {
      isStatic: true,
      friction: 0.1,
      // isSensor: true,
      label: "floor",
    });
    // this.collisionHandler(engine);
    Matter.World.add(world, [frog, floor, ...bodies, platform_0]);

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
      platform_0: {
        body: platform_0,
        size: [25, 10],
        renderer: Platform,
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
      // TODO: setup up frog bounce on platforms
      if (objA === "frog" && objB === "platform") {
        //  TODO: send the platforms downward here ??  Matter.Body.
      }
    });
  };
  // create platforms array
  get platforms() {
    const platforms = {};
    const bodies = [];
    // start with 8 platforms
    for (let i = 0; i < 8; i++) {
      const { platform, body } = this.platform;
      Object.assign(platforms, { [`platform_${COUNTER}`]: platform });
      bodies.push(body);

      COUNTER += 1;
    }

    return { platforms, bodies };
  }
  get platform() {
    const body = Matter.Bodies.rectangle(
      randomInt(13, width - 13),
      randomInt(0, height - 10),
      25,
      10,
      {
        isStatic: true,
        label: "platform",
      }
    );
    const platform = { body, size: [25, 10], renderer: Platform };

    return { platform: platform, body };
  }

  render() {
    const { appState, entities } = this.state;
    return (
      <GameEngine
        ref="engine"
        systems={[Physics, Tilt]}
        entities={entities}
        running={appState === "active"}
      ></GameEngine>
    );
  }
}

export default Game;
