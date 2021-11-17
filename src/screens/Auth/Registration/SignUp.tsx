import React, { useState, useRef, useContext, useEffect } from "react";
import {
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Text,
  Alert,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { StackNavigationProp } from "@react-navigation/stack";
import { RegistrationStackParamList, ThemeType } from "../../../types";
import { setStatusBarStyle } from "expo-status-bar";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
} from "../../../components/Text";
import { HeaderRightIcon } from "../../../components/HeaderRightIcon";
import { pixelScaler } from "../../../utils";
import ScreenContainer from "../../../components/ScreenContainer";
import { BldTextInput28 } from "../../../components/TextInput";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_ACCOUNT, VALIDATE_USERNAME } from "../../../queries";
import BottomSheetModal from "../../../components/BottomSheetModal";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { ProgressContext } from "../../../contexts/Progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { tokenVar, userIdVar } from "../../../apollo";

const ConfirmButton = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
  padding-top: ${pixelScaler(1.3)}px;
`;

const TemporaryTextContainer = styled.View`
  height: ${pixelScaler(15)}px;
  margin-bottom: ${pixelScaler(25)}px;
`;

const AgreementContainer = styled.View`
  flex-direction: row;
  align-items: center;
  height: ${pixelScaler(50)}px;
  justify-content: space-between;
`;

const CheckItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: ${pixelScaler(250)}px;
`;

const AgreementsContainer = styled.View`
  width: 100%;
  margin-bottom: ${pixelScaler(15)}px;
`;

const AgreeAllIndicatorBackground = styled.View`
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(14)}px;
`;

const AgreeAllIndicator = styled.View`
  width: ${pixelScaler(18)}px;
  height: ${pixelScaler(18)}px;
  border-radius: ${pixelScaler(18)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
`;

const SignUpButton = styled.TouchableOpacity`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(35)}px;
  align-items: center;
  justify-content: center;
  border-width: ${pixelScaler(1)}px;
  border-radius: ${pixelScaler(10)}px;
`;

const SignUp = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirm, setPasswordConfirm] = useState<string>("");
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const [privacyPolicy, setPrivacyPolicy] = useState(false);
  const [termsOfUse, setTermsOfUse] = useState(false);
  const [locationTOS, setLocationTOS] = useState(false);
  const [age14, setAge14] = useState(false);
  const [marketingInfo, setMarketingInfo] = useState(false);

  const { spinner } = useContext(ProgressContext);

  const validatePassword = (s: string) => {
    const exp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$?!@#$%^&*/])[A-Za-z\d$?!@#$%^&*/]{8,15}$/;

    return exp.test(s);
  };

  const theme = useContext<ThemeType>(ThemeContext);

  const { token, phone } =
    useRoute<RouteProp<RegistrationStackParamList, "SignUp">>().params;

  const navigation =
    useNavigation<StackNavigationProp<RegistrationStackParamList>>();

  useEffect(() => {
    setStatusBarStyle("dark");
    navigation.setOptions({
      headerTitle: () => <BldText16>Splace 시작하기</BldText16>,
      headerLeft: () => null,
      headerRight: () => (
        <HeaderRightIcon
          iconName="close"
          iconStyle={{ width: pixelScaler(11), height: pixelScaler(11) }}
          onPress={() => navigation.getParent()?.navigate("InitialScreen")}
        />
      ),
      headerStyle: {
        shadowColor: "transparent",
      },
    });
  }, []);

  const onCompleted = (data: any) => {
    if (data?.checkUsername?.ok) {
      setIsUsernameValid(true);
    } else {
      setIsUsernameValid(false);
    }
  };

  const [validateUsername, { loading: validateLoading }] = useLazyQuery(
    VALIDATE_USERNAME,
    {
      onCompleted,
    }
  );

  const onCreateAccountCompleted = (data: any) => {
    spinner.stop();
    if (data?.createAccount?.ok && data?.createAccount?.token) {
      AsyncStorage.setItem("token", data?.createAccount?.token);
      tokenVar(data?.createAccount?.token);
      userIdVar(data?.createAccount?.userId);
      navigation.push("SignUpConfirm", { username });
    } else if (data?.createAccount?.error === "ERROR3101") {
      Alert.alert("이미 존재하는 계정입니다.");
    } else {
      Alert.alert("회원가입에 실패했습니다.", data?.createAccount?.error);
    }
  };

  const [createAccountMutation, { loading: createAccountLoading }] =
    useMutation(CREATE_ACCOUNT, {
      onCompleted: onCreateAccountCompleted,
    });

  useEffect(() => {
    if (username.length >= 4) {
      if (!validateLoading) {
        validateUsername({ variables: { username } });
      }
    } else if (username !== "") {
      setIsUsernameValid(false);
    }
  }, [username]);

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
            paddingTop: pixelScaler(63),
          }}
        >
          <BldTextInput28
            value={username}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => setUsername(text.trim().toLowerCase())}
            selectionColor={theme.chatSelection}
            placeholder="user_name"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            keyboardType="ascii-capable"
            maxLength={30}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {username !== "" && !isUsernameValid ? (
              <BldText13 style={{ color: theme.errorText }}>
                사용할 수 없는 이름입니다.
              </BldText13>
            ) : null}
          </TemporaryTextContainer>
          <BldTextInput28
            value={password}
            style={{ marginBottom: pixelScaler(25), width: pixelScaler(370) }}
            onChangeText={(text) => setPassword(text.trim())}
            selectionColor={theme.chatSelection}
            placeholder="비밀번호"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            secureTextEntry={true}
            maxLength={15}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {isUsernameValid &&
            password !== "" &&
            !validatePassword(password) ? (
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
            placeholder="비밀번호 확인"
            placeholderTextColor={theme.greyTextLight}
            autoCorrect={false}
            autoCapitalize={"none"}
            secureTextEntry={true}
            maxLength={15}
            textAlign="center"
          />
          <TemporaryTextContainer>
            {isUsernameValid &&
            validatePassword(password) &&
            passwordConfirm !== "" &&
            password !== passwordConfirm ? (
              <BldText13 style={{ color: theme.errorText }}>
                비밀번호가 일치하지 않습니다
              </BldText13>
            ) : null}
          </TemporaryTextContainer>
          <ConfirmButton
            style={
              isUsernameValid && password !== "" && password === passwordConfirm
                ? { borderColor: theme.borderHighlight }
                : { borderColor: theme.greyTextLight }
            }
            onPress={() => {
              if (
                isUsernameValid &&
                password !== "" &&
                password === passwordConfirm
              ) {
                setModalVisible(true);
              }
            }}
          >
            <RegText16
              style={
                isUsernameValid &&
                password !== "" &&
                password === passwordConfirm
                  ? { color: theme.borderHighlight }
                  : { color: theme.greyTextLight }
              }
            >
              완료
            </RegText16>
          </ConfirmButton>
          <BottomSheetModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            style={{
              paddingBottom: pixelScaler(40),
              paddingHorizontal: pixelScaler(30),
              borderTopLeftRadius: pixelScaler(20),
              borderTopRightRadius: pixelScaler(20),
            }}
          >
            <AgreementsContainer>
              <AgreementContainer>
                <CheckItemContainer
                  onPress={() => {
                    setPrivacyPolicy(true);
                    setTermsOfUse(true);
                    setLocationTOS(true);
                    setAge14(true);
                    setMarketingInfo(true);
                  }}
                >
                  <AgreeAllIndicatorBackground>
                    {privacyPolicy &&
                    termsOfUse &&
                    locationTOS &&
                    age14 &&
                    marketingInfo ? (
                      <AgreeAllIndicator />
                    ) : null}
                  </AgreeAllIndicatorBackground>
                  <BldText16>클릭하여 모두 동의</BldText16>
                </CheckItemContainer>
              </AgreementContainer>
              <AgreementContainer>
                <CheckItemContainer
                  onPress={() => {
                    setPrivacyPolicy(!privacyPolicy);
                  }}
                >
                  <Ionicons
                    name="checkmark-sharp"
                    size={pixelScaler(20)}
                    style={{ marginRight: pixelScaler(20) }}
                    color={
                      privacyPolicy
                        ? theme.borderHighlight
                        : theme.greyTextLight
                    }
                  />
                  <RegText16>개인정보 처리방침 (필수)</RegText16>
                </CheckItemContainer>
                <RegText13
                  onPress={() =>
                    Linking.openURL(
                      "https://static.splace.co.kr/privacy-policy.html"
                    )
                  }
                  style={{ color: theme.greyTextAlone }}
                >
                  보기
                </RegText13>
              </AgreementContainer>
              <AgreementContainer>
                <CheckItemContainer
                  onPress={() => {
                    setTermsOfUse(!termsOfUse);
                  }}
                >
                  <Ionicons
                    name="checkmark-sharp"
                    size={pixelScaler(20)}
                    style={{ marginRight: pixelScaler(20) }}
                    color={
                      termsOfUse ? theme.borderHighlight : theme.greyTextLight
                    }
                  />
                  <RegText16>이용약관 (필수)</RegText16>
                </CheckItemContainer>
                <RegText13
                  onPress={() =>
                    Linking.openURL("https://static.splace.co.kr/tos.html")
                  }
                  style={{ color: theme.greyTextAlone }}
                >
                  보기
                </RegText13>
              </AgreementContainer>
              <AgreementContainer>
                <CheckItemContainer
                  onPress={() => {
                    setLocationTOS(!locationTOS);
                  }}
                >
                  <Ionicons
                    name="checkmark-sharp"
                    size={pixelScaler(20)}
                    style={{ marginRight: pixelScaler(20) }}
                    color={
                      locationTOS ? theme.borderHighlight : theme.greyTextLight
                    }
                  />
                  <RegText16>위치정보 이용약관 (필수)</RegText16>
                </CheckItemContainer>
                <RegText13
                  onPress={() =>
                    Linking.openURL(
                      "https://static.splace.co.kr/location-policy.html"
                    )
                  }
                  style={{ color: theme.greyTextAlone }}
                >
                  보기
                </RegText13>
              </AgreementContainer>
              <AgreementContainer>
                <CheckItemContainer
                  onPress={() => {
                    setAge14(!age14);
                  }}
                >
                  <Ionicons
                    name="checkmark-sharp"
                    size={pixelScaler(20)}
                    style={{ marginRight: pixelScaler(20) }}
                    color={age14 ? theme.borderHighlight : theme.greyTextLight}
                  />
                  <RegText16>만 14세 이상 (필수)</RegText16>
                </CheckItemContainer>
              </AgreementContainer>
              <AgreementContainer>
                <CheckItemContainer
                  onPress={() => {
                    setMarketingInfo(!marketingInfo);
                  }}
                >
                  <Ionicons
                    name="checkmark-sharp"
                    size={pixelScaler(20)}
                    style={{ marginRight: pixelScaler(20) }}
                    color={
                      marketingInfo
                        ? theme.borderHighlight
                        : theme.greyTextLight
                    }
                  />
                  <RegText16>마케팅 정보 수신 동의 (선택)</RegText16>
                </CheckItemContainer>
              </AgreementContainer>
            </AgreementsContainer>
            <SignUpButton
              style={{
                borderColor:
                  privacyPolicy && termsOfUse && locationTOS && age14
                    ? theme.textHighlight
                    : theme.greyTextLight,
              }}
              onPress={() => {
                if (privacyPolicy && termsOfUse && locationTOS && age14) {
                  if (!createAccountLoading) {
                    // navigation.push("SignUpConfirm", { username });
                    setModalVisible(false);
                    spinner.start();
                    createAccountMutation({
                      variables: {
                        username,
                        password,
                        phone,
                        token,
                        marketingAgree: marketingInfo,
                      },
                    });
                  }
                }
              }}
            >
              <RegText16
                style={{
                  color:
                    privacyPolicy && termsOfUse && locationTOS && age14
                      ? theme.textHighlight
                      : theme.greyTextLight,
                }}
              >
                동의 후 시작하기
              </RegText16>
            </SignUpButton>
          </BottomSheetModal>
        </ScreenContainer>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
