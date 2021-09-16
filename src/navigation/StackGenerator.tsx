import React, { useContext, useEffect } from "react";
import { ThemeContext } from "styled-components/native";
import {
  createStackNavigator,
  HeaderStyleInterpolators,
  CardStyleInterpolators,
  StackHeaderInterpolationProps,
  StackHeaderInterpolatedStyle,
} from "@react-navigation/stack";
import {
  Mainfeed,
  Search,
  Profile,
  Splace,
  Series,
  Saved,
  Market,
  Moment,
  Payment,
  Chatrooms,
  Chatroom,
  ChatMembers,
  MomentView,
} from "../screens";
import styled from "styled-components/native";
import { Image, Platform, View, Animated } from "react-native";
import {
  useNavigation,
  getFocusedRouteNameFromRoute,
  useRoute,
} from "@react-navigation/native";
import { StackGeneratorParamList, StackGeneratorProps } from "../types";
import { pixelScaler } from "../utils";
import { RegText13 } from "../components/Text";
import { useWindowDimensions } from "react-native";
import { setStatusBarStyle } from "expo-status-bar";

const ProfileImage = styled.TouchableOpacity`
  margin-right: 10px;
  margin-top: 5px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  border: 1px solid #404040;
`;

const Stack = createStackNavigator<StackGeneratorParamList>();

const StackGenerator = ({ screenName }: StackGeneratorProps) => {
  const theme = useContext(ThemeContext);

  const navigation = useNavigation();
  const route = useRoute();

  const focused = getFocusedRouteNameFromRoute(route) ?? screenName;
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (focused === "Chatroom" || focused === "MomentView") {
      navigation.setOptions({
        tabBarVisible: false,
      });
    } else {
      navigation.setOptions({
        tabBarVisible: true,
      });
    }
    if (focused === "MomentView") {
      setStatusBarStyle("light");
    } else {
      setStatusBarStyle("dark");
    }
  }, [focused]);

  const { add } = Animated;

  const forSlideLeft = ({
    current,
    next,
    layouts: { screen },
  }: StackHeaderInterpolationProps): StackHeaderInterpolatedStyle => {
    const progress = add(
      current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
      }),
      next
        ? next.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
          })
        : 0
    );

    const translateX = progress.interpolate({
      inputRange: [0, 1, 2],
      outputRange: [screen.width * 1, 0, -screen.width * 0.3], //[-screen.width, 0, screen.width], // [screen.width, 0, -screen.width],
    });

    const transform = [{ translateX }];

    return {
      leftButtonStyle: { transform },
      rightButtonStyle: { transform },
      titleStyle: { transform },
      backgroundStyle: { transform },
    };
  };
  // console.log(Chatrooms);
  // console.log(Chatroom);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          height: pixelScaler(95),
        },
        headerStyleInterpolator: forSlideLeft,

        // headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
      }}
    >
      {screenName === "Mainfeed" ? (
        <Stack.Screen
          name="Mainfeed"
          component={Mainfeed}
          options={{
            headerTitle: "",
            headerLeftContainerStyle: {
              marginLeft: pixelScaler(24),
              marginBottom: pixelScaler(8),
            },
            headerLeft: () => (
              <Image
                style={{ height: pixelScaler(35), width: pixelScaler(59) }}
                source={require("../../assets/images/header-left-super.png")}
              />
            ),
            headerRightContainerStyle: {
              marginRight: pixelScaler(30),
              marginBottom: pixelScaler(12),
            },
            headerRight: () => (
              <View
                style={{
                  width: pixelScaler(26),
                  height: pixelScaler(26),
                  borderRadius: pixelScaler(5),
                  borderWidth: pixelScaler(2),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#000000",
                    height: pixelScaler(12),
                    width: pixelScaler(2),
                    borderRadius: pixelScaler(1),
                  }}
                />
                <View
                  style={{
                    position: "absolute",
                    backgroundColor: "#000000",
                    height: pixelScaler(2),
                    width: pixelScaler(12),
                    borderRadius: pixelScaler(1),
                    left: pixelScaler(5),
                    top: pixelScaler(10),
                  }}
                />
              </View>
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name="Search" component={Search} />
      ) : null}
      {screenName === "Saved" ? (
        <Stack.Screen name="Saved" component={Saved} />
      ) : null}
      {screenName === "Market" ? (
        <Stack.Screen name="Market" component={Market} />
      ) : null}
      {screenName === "Moment" ? (
        <Stack.Screen name="Moment" component={Moment} />
      ) : null}
      <Stack.Screen name="Splace" component={Splace} />
      <Stack.Screen
        name="Profile"
        component={Profile}
        initialParams={{ user: { id: 1 } }} // logged in id
      />
      <Stack.Screen name="Series" component={Series} />
      <Stack.Screen name="Payment" component={Payment} />
      <Stack.Screen name="Chatrooms" component={Chatrooms} />
      <Stack.Screen name="Chatroom" component={Chatroom} />
      <Stack.Screen name="ChatMembers" component={ChatMembers} />
      <Stack.Screen name="MomentView" component={MomentView} />
    </Stack.Navigator>
  );
};

export default StackGenerator;
