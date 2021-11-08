/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { useContext } from "react";
import { useReactiveVar } from "@apollo/client";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { isLoggedInVar } from "../apollo";
import MainTab from "./MainTab";
import AuthStack from "./AuthStack";
import { ProgressContext } from "../contexts/Progress";
import Spinner from "../components/Spinner";
import ModalImagePicker from "../screens/ModalImagePicker";

const Stack = createStackNavigator();

const Navigation = () => {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const { inProgress } = useContext(ProgressContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Stack.Navigator mode="modal">
          <Stack.Screen
            name="Tabs"
            options={{ headerShown: false }}
            component={MainTab}
          />
          <Stack.Screen name="ImagePicker" component={ModalImagePicker} />
        </Stack.Navigator>
      ) : (
        <AuthStack />
      )}
      {inProgress && <Spinner />}
    </NavigationContainer>
  );
};
export default Navigation;
