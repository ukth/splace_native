/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useContext, useEffect, useRef, useState } from "react";
import { useReactiveVar } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { isLoggedInVar, menualCheckedVar } from "../apollo";
import MainTab from "./MainTab";
import AuthStack from "./AuthStack";
import { ProgressContext } from "../contexts/Progress";
import Spinner from "../components/Spinner";
import ModalImagePicker from "../screens/ModalImagePicker";
import Manual from "../screens/Manual";
import { RootStackParamList } from "../types";
import { Alert, Animated, Image, useWindowDimensions } from "react-native";
import useMe from "../hooks/useMe";
import * as Notifications from "expo-notifications";

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { inProgress } = useContext(ProgressContext);
  const menualChecked = useReactiveVar(menualCheckedVar);
  const { width, height } = useWindowDimensions();

  const [showFlash, setShowFlash] = useState(true);

  const me = useMe();

  // (async () => {
  //   const { status: existingStatus } =
  //     await Notifications.getPermissionsAsync();
  //   let finalStatus = existingStatus;

  //   if (existingStatus !== "granted") {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     finalStatus = status;
  //   }

  //   if (finalStatus !== "granted") {
  //     alert("Failed to get push token for push notification!");
  //     return;
  //   }
  //   let token = (await Notifications.getExpoPushTokenAsync()).data;

  //   if (me.id === 2) {
  //     Alert.alert(token);
  //   }
  // })();

  const animatedValue = useRef(new Animated.Value(0)).current;
  // animatedValue.addListener((v) => console.log(v.value));

  const popSplash = () => {
    setShowFlash(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const hideFlash = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShowFlash(false));
  };
  // const shorten = () => {};

  useEffect(() => {
    popSplash();
    // setTimeout(() => {
    //   setShowFlash(false);
    // }, 2500);
    setTimeout(() => {
      hideFlash();
    }, 2500);
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        showFlash ? (
          <Animated.Image
            source={{
              uri: "https://splace-public-images.s3.ap-northeast-2.amazonaws.com/splash.png",
            }}
            resizeMode={"contain"}
            style={{
              position: "absolute",
              left: -1,
              width: width + 2,
              height,
              opacity: animatedValue,
            }}
          />
        ) : (
          <Stack.Navigator mode="modal">
            <Stack.Screen
              name="Tabs"
              options={{ headerShown: false }}
              component={MainTab}
            />
            <Stack.Screen name="ImagePicker" component={ModalImagePicker} />

            <Stack.Screen name="Manual" component={Manual} />
          </Stack.Navigator>
        )
      ) : (
        <AuthStack />
      )}
      {inProgress && <Spinner />}
    </NavigationContainer>
  );
};
export default Navigation;
