import React, { useState, useRef, useContext, useEffect } from "react";
import { TouchableWithoutFeedback, Keyboard, Image, Text } from "react-native";
import styled from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { isLoggedInVar, tokenVar, cache, logUserIn } from "../apollo";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList } from "../types";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN } from "../queries";
import { Alert } from "react-native";
import { RegText13 } from "../components/Text";
import { TextInput } from "react-native-gesture-handler";

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

const StyledTextInput = styled.TextInput`
  background-color: #f0f0f0;
  width: 300px;
  height: 25px;
  margin-bottom: 10px;
`;

const LogIn = ({
  navigation,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
}) => {
  const insets = useSafeAreaInsets();

  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  const _handleLogInButtonPress = async () => {
    console.log(id, pw, "#####");
    if (!loading) {
      mutation({
        variables: {
          username: id,
          password: pw,
        },
      });
    }
  };

  const onCompleted = async (data: {
    login: {
      ok: boolean;
      token: string;
      user: any;
    };
  }) => {
    console.log(data);
    const {
      login: { ok, token, user },
    } = data;
    if (ok) {
      await logUserIn(token, user.id);
      console.log(token);
      // isLoggedInVar(true);
      // tokenVar(
      //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyOTE2NjgwOH0.yUGginGMQSabKVnG_gItSdGvgozLYl9dTFDf4ig994M"
      // );
    } else {
      Alert.alert("login failed!");
    }
  };

  const [mutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted,
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={40}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <RegText13>id</RegText13>
          <StyledTextInput
            autoCapitalize={"none"}
            onChangeText={(text) => setId(text)}
          />
          <RegText13>pw</RegText13>
          <StyledTextInput
            autoCapitalize={"none"}
            onChangeText={(text) => setPw(text)}
            secureTextEntry={true}
          />
          <Button onPress={_handleLogInButtonPress}>
            <Text
              style={{
                color: "#d0d0d0",
              }}
            >
              LogIn
            </Text>
          </Button>
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default LogIn;
