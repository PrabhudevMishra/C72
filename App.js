import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import TransactionScreen from "./screens/bookTransactionScreen";
import SearchScreen from "./screens/searchScreen";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const TabNavigator = createBottomTabNavigator({
  Transaction: {
    screen: TransactionScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("./assets/book.png")}
          style={{ width: 40, height: 40 }}
        />
      ),
      tabBarLabel: "Transactions",
    },
  },
  Search: {
    screen: SearchScreen,
    navigationOptions: {
      tabBarIcon: (
        <Image
          source={require("./assets/searchingbook.png")}
          style={{ width: 40, height: 40 }}
        />
      ),
      tabBarLabel: "Search",
    },
  },
});
const AppContainer = createAppContainer(TabNavigator);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
