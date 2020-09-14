import { Button, View } from "react-native";

import React from "react";

const Dashboard = ({ navigation }) => {
  return (
    <View>
      <Button title="Play" onPress={() => navigation.navigate("Game")} />
    </View>
  );
};

export default Dashboard;
