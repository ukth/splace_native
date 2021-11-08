import React, { useState, useContext, useEffect } from "react";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { isLoggedInVar, logUserIn, tokenVar } from "../../apollo";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  AuthStackParamList,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { useMutation, useQuery } from "@apollo/client";
import { LOGIN } from "../../queries";
import { Alert } from "react-native";
import ScreenContainer from "../../components/ScreenContainer";
import { setStatusBarStyle } from "expo-status-bar";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
} from "../../components/Text";
import { Icon } from "../../components/Icon";
import { HeaderRightIcon } from "../../components/HeaderRightIcon";
import { pixelScaler } from "../../utils";
import { BldTextInput28 } from "../../components/TextInput";
import { useNavigation } from "@react-navigation/core";
import * as Linking from "expo-linking";

const ConfirmButton = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.borderHighlight};
  align-items: center;
  justify-content: center;
`;

const TemporaryTextContainer = styled.View`
  height: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(25)}px;
`;

const LogIn = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const theme = useContext<ThemeType>(ThemeContext);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();
  const [loginFailed, setLoginFailed] = useState(false);

  useEffect(() => {
    setStatusBarStyle("dark");
    navigation.setOptions({
      headerTitle: () => <BldText16>로그인</BldText16>,
      headerLeft: () => null,
      headerRight: () => (
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
  }, []);

  const _handleLogInButtonPress = async () => {
    if (username.length >= 4 && password.length >= 6) {
      if (!loading) {
        mutation({
          variables: {
            username: username,
            password: password,
          },
        });
      }
    }
  };

  const onCompleted = async (data: {
    login: {
      ok: boolean;
      token: string;
      user: any;
    };
  }) => {
    const {
      login: { ok, token, user },
    } = data;
    if (ok) {
      await logUserIn(token, user.id);
      tokenVar(token);
      isLoggedInVar(true);
    } else {
      setLoginFailed(true);
    }
  };

  const [mutation, { loading, error }] = useMutation(LOGIN, {
    onCompleted,
  });

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
            paddingTop: pixelScaler(50),
          }}
        >
          <BldTextInput28
            value={username}
            style={{ marginBottom: pixelScaler(60), width: pixelScaler(370) }}
            onChangeText={(text) => setUsername(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="사용자 이름"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="ascii-capable"
            maxLength={31}
            textAlign="center"
          />
          <BldTextInput28
            value={password}
            style={{ marginBottom: pixelScaler(30), width: pixelScaler(370) }}
            onChangeText={(text) => setPassword(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="비밀번호"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="ascii-capable"
            maxLength={20}
            secureTextEntry={true}
            textAlign="center"
          />
          <TemporaryTextContainer>
            <RegText13 style={{ color: theme.errorText }}>
              {loginFailed ? "아이디와 비밀번호가 일치하지 않습니다." : ""}
            </RegText13>
          </TemporaryTextContainer>
          <ConfirmButton
            onPress={_handleLogInButtonPress}
            style={{ marginBottom: pixelScaler(75) }}
          >
            <RegText16 style={{ color: theme.textHighlight }}>완료</RegText16>
          </ConfirmButton>
          <BldText13
            style={{ color: theme.greyTextLight, lineHeight: pixelScaler(20) }}
          >
            <BldText13
              onPress={() => {
                navigation.pop();
                navigation.push("CertifyForUsername");
              }}
              style={{ color: theme.textHighlight }}
            >
              아이디
            </BldText13>
            {", "}
            <BldText13
              style={{ color: theme.textHighlight }}
              onPress={() => {
                navigation.pop();
                navigation.push("CertifyForPassword");
              }}
            >
              {"비밀번호"}
            </BldText13>
            {"가 기억나지 않으시나요?"}
          </BldText13>
          <BldText13 style={{ color: theme.greyTextLight }}>
            {"Splace가 처음이라면 "}
            <BldText13
              onPress={() => {
                // console.log("hello");
                navigation.pop();
                navigation.push("RegistrationStack");
              }}
              style={{ color: theme.textHighlight }}
            >
              여기서
            </BldText13>
            {" 시작해 보세요"}
          </BldText13>
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default LogIn;
