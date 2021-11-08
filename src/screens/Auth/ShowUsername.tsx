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
import {
  BldText13,
  BldText16,
  BldText28,
  RegText13,
} from "../../components/Text";
import { HeaderRightIcon } from "../../components/HeaderRightIcon";
import { pixelScaler } from "../../utils";
import ScreenContainer from "../../components/ScreenContainer";
import { BldTextInput28 } from "../../components/TextInput";
import { useMutation, useQuery } from "@apollo/client";
import { FIND_USERNAME } from "../../queries";

const ShowUsername = () => {
  const [phone, setPhone] = useState<string>("");
  const [certificate, setCertificate] = useState<string>("");

  const theme = useContext<ThemeType>(ThemeContext);

  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const { token } =
    useRoute<RouteProp<AuthStackParamList, "ShowUsername">>().params;

  const { data } = useQuery(FIND_USERNAME, { variables: { token } });

  useEffect(() => {
    setStatusBarStyle("dark");
    navigation.setOptions({
      headerTitle: () => <BldText16>지금 Splace를 시작해 보세요</BldText16>,
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
          <BldText13
            style={{
              marginBottom: pixelScaler(120),
            }}
          >
            {"회원님의 아이디는 다음과 같습니다.\n"}
          </BldText13>
          <BldText28 style={{ marginBottom: pixelScaler(120) }}>
            {data?.getUsername?.username ?? ""}
          </BldText28>

          <BldText13
            style={{ color: theme.greyTextLight, lineHeight: pixelScaler(20) }}
            onPress={() => {
              navigation.pop();
              navigation.push("LogIn");
            }}
          >
            {"여기서 바로 "}
            <BldText13 style={{ color: theme.textHighlight }}>로그인</BldText13>
            {" 하세요."}
          </BldText13>
          <BldText13 style={{ color: theme.greyTextLight }}>
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
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default ShowUsername;
