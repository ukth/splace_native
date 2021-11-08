import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  InitialScreen,
  LogIn,
  CertifyForUsername,
  CertifyForPassword,
  ShowUsername,
  ChangePassword,
} from "../screens/Auth";
import { AuthStackParamList } from "../types";
import RegistrationStack from "./RegistrationStack";

const Stack = createStackNavigator<AuthStackParamList>();

const AuthStack = () => {
  console.log("sadnjkfdsj");

  return (
    <Stack.Navigator
      initialRouteName="InitialScreen"
      screenOptions={{
        headerTitleAlign: "center",
      }}
      mode="modal"
    >
      <Stack.Screen
        name="InitialScreen"
        component={InitialScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrationStack"
        component={RegistrationStack}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="LogIn" component={LogIn} />
      <Stack.Screen name="CertifyForUsername" component={CertifyForUsername} />
      <Stack.Screen name="CertifyForPassword" component={CertifyForPassword} />
      <Stack.Screen name="ShowUsername" component={ShowUsername} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
    </Stack.Navigator>
  );
};

export default AuthStack;
