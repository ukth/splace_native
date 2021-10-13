import React, { useState, useEffect, useRef, useContext } from "react";

import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { BldTextInput20 } from "../../components/TextInput";
import { BldText13 } from "../../components/Text";
import { StackGeneratorParamList, themeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../../utils";
import { Alert, Keyboard, TouchableWithoutFeedback } from "react-native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { StackNavigationProp } from "@react-navigation/stack";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { CHANGE_PASSWORD, EDIT_PROFILE } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";

const Container = styled.View`
  flex: 1;
  align-items: center;
`;

const ChangePassword = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const theme = useContext<themeType>(ThemeContext);
  const { spinner } = useContext(ProgressContext);

  const reg =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$?!@#$%^&*/])[A-Za-z\d$?!@#$%^&*/]{8,}$/;

  const onCompleted = ({
    editProfile: { ok, error },
  }: {
    editProfile: {
      ok: boolean;
      error: string;
    };
  }) => {
    if (ok) {
      Alert.alert("비밀번호가 변경되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("비밀번호를 변경할 수 없습니다.\n" + error);
    }
    spinner.stop();
  };

  const [mutation, { loading }] = useMutation(CHANGE_PASSWORD, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      title: "비밀번호 변경",
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (password === passwordConfirm && reg.test(password)) {
              spinner.start();
              console.log(password);
              mutation({ variables: { password } });
            }
          }}
        />
      ),
    });
  }, [password, passwordConfirm]);

  return (
    <ScreenContainer>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container>
          <BldTextInput20
            selectionColor={theme.chatSelection}
            secureTextEntry={true}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={(text) => setPassword(text.trim())}
            placeholder="새 비밀번호"
            textAlign="center"
            placeholderTextColor={theme.passwordChangeGreyText}
            style={{
              width: "100%",
              marginTop: pixelScaler(90),
              marginBottom: pixelScaler(20),
            }}
          />
          <BldText13
            style={{
              color:
                password === "" || reg.test(password)
                  ? theme.passwordChangeGreyText
                  : theme.errorText,
              marginBottom: pixelScaler(80),
            }}
          >
            {"영문, 숫자, 특수문자(?!@#$%^&*/) 혼합 8~15자"}
          </BldText13>
          <BldTextInput20
            selectionColor={theme.chatSelection}
            secureTextEntry={true}
            maxLength={20}
            autoCapitalize="none"
            autoCorrect={false}
            value={passwordConfirm}
            onChangeText={(text) => setPasswordConfirm(text.trim())}
            placeholder="새 비밀번호 확인"
            textAlign="center"
            placeholderTextColor={theme.passwordChangeGreyText}
            style={{
              width: "100%",
              marginBottom: pixelScaler(20),
            }}
          />
          {passwordConfirm !== "" && passwordConfirm !== password ? (
            <BldText13
              style={{
                color: theme.errorText,
              }}
            >
              {"비밀번호가 일치하지 않습니다"}
            </BldText13>
          ) : null}
        </Container>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
};

export default ChangePassword;
