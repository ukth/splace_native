/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { Image } from "react-native";
// import Image from "../components/Image";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { BottomTabParamList } from "../types";
import { pixelScaler } from "../utils";
import StackGenerator from "./StackGenerator";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const tabBarIcons = {
  Mainfeed: {
    activeIcon: require("../../assets/images/tabBarIcons/home-selected.png"),
    inactiveIcon: require("../../assets/images/tabBarIcons/home.png"),
  },
  Search: {
    activeIcon: require("../../assets/images/tabBarIcons/search-selected.png"),
    inactiveIcon: require("../../assets/images/tabBarIcons/search.png"),
  },
  Market: {
    activeIcon: require("../../assets/images/tabBarIcons/market.png"),
    inactiveIcon: require("../../assets/images/tabBarIcons/market.png"),
  },
  Keep: {
    activeIcon: require("../../assets/images/tabBarIcons/keep-selected.png"),
    inactiveIcon: require("../../assets/images/tabBarIcons/keep.png"),
  },
  Profile: {
    activeIcon: require("../../assets/images/tabBarIcons/profile-selected.png"),
    inactiveIcon: require("../../assets/images/tabBarIcons/profile.png"),
  },
};

const TabBarIcon = ({
  focused,
  screenName,
}: {
  focused: boolean;
  screenName: "Mainfeed" | "Search" | "Market" | "Keep" | "Profile";
}) => {
  return (
    <Image
      source={
        focused
          ? tabBarIcons[screenName].activeIcon
          : tabBarIcons[screenName].inactiveIcon
      }
      style={
        screenName === "Keep"
          ? { width: pixelScaler(13), height: pixelScaler(19) }
          : { width: pixelScaler(19), height: pixelScaler(19) }
      }
    />
  );
};

export default function MainTab() {
  const colorScheme = "light";

  return (
    <BottomTab.Navigator
      initialRouteName="Mainfeed"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        style: {
          height: pixelScaler(85),
        },
        showLabel: false,
      }}
      // screenOptions={{
      //   headerShown: false,
      // }}
    >
      <BottomTab.Screen
        name="Mainfeed"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon screenName="Mainfeed" focused={focused} />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="Mainfeed" />;
        }}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon screenName="Search" focused={focused} />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="Search" />;
        }}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="Market"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon screenName="Market" focused={focused} />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="Market" />;
        }}
      </BottomTab.Screen>

      <BottomTab.Screen
        name="Keep"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon screenName="Keep" focused={focused} />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="Keep" />;
        }}
      </BottomTab.Screen>
      <BottomTab.Screen
        name="Profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon screenName="Profile" focused={focused} />
          ),
        }}
      >
        {() => {
          return <StackGenerator screenName="Profile" />;
        }}
      </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
