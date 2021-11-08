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
import { RegistrationStackParamList, ThemeType } from "../../../types";
import { setStatusBarStyle } from "expo-status-bar";
import { useNavigation } from "@react-navigation/core";
import { BldText13, BldText16, RegText13 } from "../../../components/Text";
import { HeaderRightIcon } from "../../../components/HeaderRightIcon";
import { pixelScaler } from "../../../utils";
import ScreenContainer from "../../../components/ScreenContainer";
import { BldTextInput28 } from "../../../components/TextInput";
import { useMutation } from "@apollo/client";
import { REQUEST_CERTIFICATE, VERIFY_CERTIFICATE } from "../../../queries";
import * as Linking from "expo-linking";
import { ProgressContext } from "../../../contexts/Progress";

const ConfirmButton = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
  margin-bottom: ${pixelScaler(75)}px;
`;

const TemporaryTextContainer = styled.View`
  height: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(25)}px;
`;

const CertifyPhone = () => {
  const [phone, setPhone] = useState<string>("");
  const [certificate, setCertificate] = useState<string>("");

  const theme = useContext<ThemeType>(ThemeContext);

  const navigation =
    useNavigation<StackNavigationProp<RegistrationStackParamList>>();
  const [sent, setSent] = useState(false);
  const [lastTime, setLastTime] = useState(180);
  const [certificateFailed, setCertificateFailed] = useState(false);

  const { spinner } = useContext(ProgressContext);
  const [timerId, setTimerId] = useState<NodeJS.Timer>();

  const onVerifyCompleted = (data: any) => {
    if (data?.checkCertificate?.ok && data?.checkCertificate?.token?.length) {
      navigation.push("SignUp", {
        token: data?.checkCertificate?.token,
        phone,
      });
      if (timerId) {
        clearInterval(timerId);
      }
      setLastTime(0);
    } else {
      setCertificateFailed(true);
      setCertificate("");
      console.log("failed!");
    }
  };

  const [verifyMutation, { loading: verifyMutationLoading }] = useMutation(
    VERIFY_CERTIFICATE,
    {
      onCompleted: onVerifyCompleted,
    }
  );

  const onRequestCompleted = (data: any) => {
    spinner.stop();
    if (data?.createCertificate?.ok) {
      setSent(true);
      setCertificateFailed(false);
      setLastTime(180);
      if (timerId) {
        clearInterval(timerId);
      }
      console.log("HEllo");
      console.log(timerId);
      setTimerId(
        setInterval(() => {
          setLastTime((prev) => (prev > 0 ? prev - 1 : prev));
        }, 1000)
      );
      console.log(timerId);

      Alert.alert("인증번호가 전송되었습니다.");
    } else {
      Alert.alert("인증번호 요청에 실패했습니다.");
    }
  };

  const [requestMutation, { loading: requestMutationLoading }] = useMutation(
    REQUEST_CERTIFICATE,
    {
      onCompleted: onRequestCompleted,
    }
  );

  const requestCertificate = () => {
    setCertificate("");
    // clearInterval(timerId);
    if (phone.length > 9) {
      if (!requestMutationLoading) {
        spinner.start();
        requestMutation({
          variables: {
            phone,
            isRegister: false,
          },
        });
      }
    }
  };

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
          <BldTextInput28
            value={phone}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => setPhone(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="010XXXXXXXX"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="number-pad"
            maxLength={11}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {sent ? (
              <RegText13>
                {"인증번호를 받지 못하셨나요? "}
                <RegText13
                  style={{ color: theme.textHighlight }}
                  onPress={() => {
                    // clearInterval(timerId);
                    requestCertificate();
                  }}
                >
                  재전송
                </RegText13>
              </RegText13>
            ) : null}
          </TemporaryTextContainer>
          <BldTextInput28
            value={certificate}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => {
              setCertificate(text.trim());
              setCertificateFailed(false);
            }}
            selectionColor={theme.chatSelection}
            placeholder="인증번호"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="number-pad"
            maxLength={6}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {sent ? (
              certificateFailed ? (
                <BldText13 style={{ color: theme.errorText }}>
                  인증번호가 일치하지 않습니다.
                </BldText13>
              ) : (
                <BldText13>
                  {Math.floor(lastTime / 60) +
                    (lastTime % 60 < 10 ? ":0" : ":") +
                    (lastTime % 60)}
                </BldText13>
              )
            ) : null}
          </TemporaryTextContainer>
          {sent ? (
            !certificateFailed && certificate.length === 6 ? (
              <ConfirmButton
                style={{ borderColor: theme.borderHighlight }}
                onPress={() => {
                  verifyMutation({
                    variables: {
                      phone,
                      certificate,
                    },
                  });
                }}
              >
                <RegText13 style={{ color: theme.textHighlight }}>
                  완료
                </RegText13>
              </ConfirmButton>
            ) : (
              <ConfirmButton style={{ borderColor: theme.greyTextLight }}>
                <RegText13 style={{ color: theme.greyTextLight }}>
                  완료
                </RegText13>
              </ConfirmButton>
            )
          ) : phone.length > 9 ? (
            <ConfirmButton
              style={{ borderColor: theme.borderHighlight }}
              onPress={requestCertificate}
            >
              <RegText13 style={{ color: theme.textHighlight }}>전송</RegText13>
            </ConfirmButton>
          ) : (
            <ConfirmButton style={{ borderColor: theme.greyTextLight }}>
              <RegText13 style={{ color: theme.greyTextLight }}>전송</RegText13>
            </ConfirmButton>
          )}
          <RegText13
            style={{
              color: theme.greyTextLight,
              marginBottom: pixelScaler(10),
            }}
          >
            {"이미 계정이 있다면 "}
            <RegText13
              style={{ color: theme.textHighlight }}
              onPress={() => {
                // navigation.push("TasteCup");
                navigation.getParent()?.navigate("LogIn");
              }}
            >
              여기서
            </RegText13>
            {" 로그인하세요"}
          </RegText13>
          <RegText13
            style={{
              color: theme.greyTextLight,
              marginBottom: pixelScaler(50),
            }}
          >
            {"회원가입 과정에서의 "}
            <RegText13
              style={{ color: theme.textHighlight }}
              onPress={() => {
                Linking.openURL("mailto:contact@lunen.co.kr");
              }}
            >
              문제 신고
            </RegText13>
          </RegText13>
          <RegText13
            style={{
              color: theme.greyTextLighter,
              lineHeight: pixelScaler(20),
            }}
          >
            {"쾌적한 서비스를 위해 모든 사용자는 휴대폰으로"}
          </RegText13>
          <RegText13
            style={{
              color: theme.greyTextLighter,
              lineHeight: pixelScaler(20),
            }}
          >
            {"본인을 인증하여야 합니다. 번호는 어디에도 공개되지"}
          </RegText13>
          <RegText13
            style={{
              color: theme.greyTextLighter,
              lineHeight: pixelScaler(20),
            }}
          >
            {"않으며 가장 안전하게 보호됩니다.\n"}
          </RegText13>
          <RegText13
            style={{
              color: theme.greyTextLighter,
              lineHeight: pixelScaler(20),
            }}
          >
            {"Splace는 커뮤니티 환경의 유지를 위해 만 14세 이상의 "}
          </RegText13>
          <RegText13
            style={{
              color: theme.greyTextLighter,
              lineHeight: pixelScaler(20),
            }}
          >
            {"이용자만 허용하고 있습니다."}
          </RegText13>
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default CertifyPhone;
