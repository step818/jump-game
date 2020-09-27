import { AppState, Dimensions, Text, TextPropTypes } from "react-native";
import { Floor, Frog, Platform } from "../renderers/renderers.js";
import { Jump, Physics, Tilt } from "../systems/Systems.js";
import React, { PureComponent } from "react";

import { Accelerometer } from "expo-sensors";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { get } from "lodash";
import randomInt from "random-int";

const INIT_COMPLEXITY = 0;
const { width, height } = Dimensions.get("window");

let COUNTER = 1;

class Game extends PureComponent {
  static navigationOptions = {
    headerShown: false,
  };

  constructor() {
    super();
    this.state = this.initState;
  }

  get initState() {
    return {
      complexity: INIT_COMPLEXITY,
      score: 0,
      entities: this.entities,
      appState: "active",
    };
  }

  componentDidMount() {
    this._subscription = Accelerometer.addListener(({ x }) => {
      Matter.Body.set(this.refs.engine.state.entities.frog.body, {
        xtilt: x,
      });
    });

    AppState.addEventListener("change", this.handleAppStateChange);
  }

  componentDidUpdate(prevProps, prevState) {
    const { complexity } = this.state;
    if (complexity !== prevState.complexity && complexity !== INIT_COMPLEXITY) {
      const { world } = this.engine.props.entities.physics;
      const { platform, body } = this.platform;

      Matter.World.addBody(world, body);
      const updatedPlatforms = {
        ...this.state.entities,
        [`platform_${COUNTER}`]: platform,
      };

      COUNTER += 1;

      this.setState({ entities: updatedPlatforms }, () =>
        this.engine.swap(updatedPlatforms)
      );
    }
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
    this.collisionHandler(engine, frog);
    Matter.World.add(world, [frog, floor, ...bodies, platform_0]);

    return {
      physics: {
        engine,
        world,
      },
      ...platforms,
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
      floor: {
        body: floor,
        size: [width + 100, 100],
        renderer: Floor,
      },
    };
  }

  collisionHandler = (engine, frog) => {
    Matter.Events.on(engine, "collisionStart", (event) => {
      const { pairs } = event;
      const objA = pairs[0].bodyA.label;
      const objB = pairs[0].bodyB.label;
      // This one is still unknown to me
      const frogBottom = pairs[0].bodyA.bounds.min.y;
      // This is confirmed the correct value for platformTop
      const platformTop = pairs[0].bodyB.bounds.max.y;
      // This is confirmed the correct value for velocity
      const frogVelocity = pairs[0].bodyA.velocity.y;
      if (objA === "frog" && objB === "platform") {
        //  Might have to move some constants in here for when objB || jobjA != frog or platform. floor
        //  TODO: send the platforms downward here ??  Matter.Body.
        if (
          Math.abs(platformTop - frogBottom) < -frogVelocity &&
          platformTop < frogBottom
        ) {
          console.log(frogVelocity + " : frogVelocity");
          console.log("Boing!");
          console.log(frogBottom + " : frogBottom");
          console.log(platformTop + " platformTop");
        }
        console.log(event);

        // let frogMiddle = objA.position.y;
        console.log("height of the screen: " + height);
        console.log("The width of the screen: " + width);
        console.log("frog entitie: " + frog);
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

    return { platform, body };
  }

  render() {
    const { appState, entities } = this.state;
    return (
      <GameEngine
        ref="engine"
        systems={[Physics, Tilt, Jump, Jump]}
        entities={entities}
        running={appState === "active"}
      ></GameEngine>
    );
  }
}

export default Game;
