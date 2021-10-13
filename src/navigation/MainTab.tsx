/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { BottomTabParamList } from "../types";
import { pixelScaler } from "../utils";
import StackGenerator from "./StackGenerator";

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) => {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
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
      }}
      // screenOptions={{
      //   headerShown: false,
      // }}
    >
      <BottomTab.Screen
        name="Mainfeed"
        options={{
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="ios-code" color={color} />
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
