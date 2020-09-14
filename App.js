import React, { PureComponent } from "react";

import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import Navigator from "./Navigator.js";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";

export default class App extends PureComponent {
  state = {
    isLoadingComplete: false,
  };

  loadResourcesAsync = async () =>
    Promise.all([Asset.loadAsync([require("./assets/favicon.png")])]);

  handeLoadingError = (error) => {
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handeLoadingError}
          onFinish={this.handleFinishLoading}
        />
      );
    }
    return <Navigator />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
