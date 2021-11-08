import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {
  CertifyPhone,
  SignUp,
  TasteCup,
  SignUpConfirm,
} from "../screens/Auth/Registration";
import { RegistrationStackParamList } from "../types";

const Stack = createStackNavigator<RegistrationStackParamList>();

const RegistrationStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="CertifyPhone"
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="CertifyPhone" component={CertifyPhone} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="SignUpConfirm" component={SignUpConfirm} />
      <Stack.Screen name="TasteCup" component={TasteCup} />
    </Stack.Navigator>
  );
};

export default RegistrationStack;
