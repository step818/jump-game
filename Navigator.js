import Dashboard from "./screens/Dashboard";
import Game from "./screens/Game";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const Navigator = createStackNavigator({
  Dashboard: {
    screen: Dashboard,
  },
  Game: {
    screen: Game,
  },
});

export default createAppContainer(Navigator);
