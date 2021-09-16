import React, { useState, useRef, useContext, useEffect } from "react";
import { TouchableWithoutFeedback, Keyboard, Image, Text } from "react-native";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isLoggedInVar, tokenVar, cache } from "../apollo";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList } from "../types";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 0 20px;
  padding-top: 10px;
  padding-bottom: 10px;
`;

const Button = styled.TouchableOpacity`
  background-color: #0351dd;
  align-items: center;
  border-radius: 4px;
  width: 100%;
  padding: 10px;
`;

const SignUp = ({
  navigation,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
}) => {
  const insets = useSafeAreaInsets();

  const _handleLoginButtonPress = async () => {
    isLoggedInVar(true);
    tokenVar(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyOTE2NjgwOH0.yUGginGMQSabKVnG_gItSdGvgozLYl9dTFDf4ig994M"
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={40}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <Button onPress={_handleLoginButtonPress}>
            <Text
              style={{
                color: "#d0d0d0",
              }}
            >
              Login
            </Text>
          </Button>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
