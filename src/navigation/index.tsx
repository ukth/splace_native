/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useContext, useEffect, useState } from "react";
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
import { Image, useWindowDimensions } from "react-native";

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { inProgress } = useContext(ProgressContext);
  const menualChecked = useReactiveVar(menualCheckedVar);
  const { width, height } = useWindowDimensions();

  const [showFlash, setShowFlash] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowFlash(false);
    }, 2500);
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        showFlash ? (
          <Image
            source={{
              uri: "https://splace-public-images.s3.ap-northeast-2.amazonaws.com/splash.png",
            }}
            resizeMode={"contain"}
            style={{
              position: "absolute",
              left: -1,
              width: width + 2,
              height,
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
