/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useContext } from "react";
import { useReactiveVar } from "@apollo/client";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";
import { isLoggedInVar } from "../apollo";
import MainTab from "./MainTab";
import AuthStack from "./AuthStack";
import * as Linking from "expo-linking";
import { ProgressContext } from "../contexts/Progress";
import Spinner from "../components/Spinner";

// const prefix = Linking.makeUrl("/");

const Navigation = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { inProgress } = useContext(ProgressContext);

  // const linking = {
  //   prefixes: [prefix],
  //   config: {
  //     screens: {
  //       Profile: "Profile",
  //       Settings: "settings",
  //     },
  //   },
  // };

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTab /> : <AuthStack />}
      {inProgress && <Spinner />}
      {/* <RootNavigator /> */}
    </NavigationContainer>
  );
};
export default Navigation;

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
// const Stack = createStackNavigator<RootStackParamList>();

// function RootNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Root" component={BottomTabNavigator} />
//       <Stack.Screen
//         name="NotFound"
//         component={NotFoundScreen}
//         options={{ title: "Oops!" }}
//       />
//     </Stack.Navigator>
//   );
// }
