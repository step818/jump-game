import { Image, View } from "react-native";

import React from "react";

// import frog from "../assets/images/frog.png";

const Frog = ({ body, size }) => {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "green",
      }}
    />
  );
};

const Floor = ({ body, size }) => {
  const width = size[0];
  const height = size[1];

  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        backgroundColor: "red",
      }}
    />
  );
};

export { Frog, Floor };
