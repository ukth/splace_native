import React, { useState, useRef, useContext, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text,
  Alert,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  AuthStackParamList,
  RegistrationStackParamList,
  ThemeType,
} from "../../types";
import { setStatusBarStyle } from "expo-status-bar";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { BldText13, BldText16, RegText13 } from "../../components/Text";
import { HeaderRightIcon } from "../../components/HeaderRightIcon";
import { pixelScaler } from "../../utils";
import ScreenContainer from "../../components/ScreenContainer";
import { BldTextInput28 } from "../../components/TextInput";
import { useMutation } from "@apollo/client";
import {
  EDIT_PASSWORD,
  REQUEST_CERTIFICATE,
  VERIFY_CERTIFICATE,
} from "../../queries";
import * as Linking from "expo-linking";
import { ProgressContext } from "../../contexts/Progress";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { Icon } from "../../components/Icon";
import { TouchableOpacity } from "react-native-gesture-handler";

const ConfirmButton = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${pixelScaler(75)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const TemporaryTextContainer = styled.View`
  height: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(25)}px;
`;

const ChangePassword = () => {
  const theme = useContext<ThemeType>(ThemeContext);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");

  const { spinner } = useContext(ProgressContext);

  const { token } =
    useRoute<RouteProp<AuthStackParamList, "ChangePassword">>().params;

  const validatePassword = (s: string) => {
    const exp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$?!@#$%^&*/])[A-Za-z\d$?!@#$%^&*/]{8,15}$/;

    return exp.test(s);
  };

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editPassword?.ok) {
      Alert.alert(
        "",
        "비밀번호가 변경되었습니다.\n로그인 창으로 이동하시겠습니까?",
        [
          {
            text: "확인",
            onPress: () => navigation.push("LogIn"),
          },
          {
            text: "취소",
            style: "cancel",
          },
        ]
      );
    } else {
      Alert.alert("비밀번호를 변경할 수 없습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_PASSWORD, { onCompleted });

  useEffect(() => {
    setStatusBarStyle("dark");
    navigation.setOptions({
      headerTitle: () => <BldText16>비밀번호 재설정</BldText16>,
      headerLeft: () =>
        null,
        // <TouchableOpacity onPress={() => navigation.pop()}>
        //   <Icon
        //     name="close"
        //     style={{ width: pixelScaler(11), height: pixelScaler(11) }}
        //   />
        // </TouchableOpacity>
      headerRight: () =>
        validatePassword(password) &&
        passwordConfirm !== "" &&
        password === passwordConfirm ? (
          <HeaderRightConfirm
            onPress={() => {
              if (!loading) {
                spinner.start();
                mutation({
                  variables: {
                    token,
                    password,
                  },
                });
              }
            }}
          />
        ) : (
          <HeaderRightIcon
            iconName="close"
            iconStyle={{ width: pixelScaler(11), height: pixelScaler(11) }}
            onPress={() => navigation.pop()}
          />
        ),
      headerStyle: {
        shadowColor: "transparent",
      },
    });
  }, [password, passwordConfirm]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={40}
      style={{
        backgroundColor: theme.background,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScreenContainer
          style={{
            alignItems: "center",
            paddingTop: pixelScaler(100),
          }}
        >
          <BldTextInput28
            value={password}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => setPassword(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="새 비밀번호"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            secureTextEntry={true}
            maxLength={15}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {password !== "" && !validatePassword(password) ? (
              <BldText13 style={{ color: theme.errorText }}>
                영문, 숫자, 특수문자 혼합 8 - 15자
              </BldText13>
            ) : null}
          </TemporaryTextContainer>
          <BldTextInput28
            value={passwordConfirm}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => setPasswordConfirm(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="새 비밀번호 확인"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            secureTextEntry={true}
            maxLength={15}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {validatePassword(password) &&
            passwordConfirm !== "" &&
            password !== passwordConfirm ? (
              <BldText13 style={{ color: theme.errorText }}>
                비밀번호가 일치하지 않습니다
              </BldText13>
            ) : null}
          </TemporaryTextContainer>
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default ChangePassword;
