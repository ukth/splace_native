import React, { useState, useEffect, useRef } from "react";
import { Alert, useWindowDimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList } from "../../types";
import { RegTextInput13 } from "../../components/TextInput";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import styled from "styled-components/native";
import { pixelScaler } from "../../utils";
import { BldText16, RegText16 } from "../../components/Text";
import { Ionicons } from "@expo/vector-icons";
import { View } from "../../components/Themed";
import { logUserOut } from "../../apollo";
import { DELETE_ACCOUNT } from "../../queries";
import * as Linking from "expo-linking";
import { Icon } from "../../components/Icon";

const ButtonContainer = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(30)}px;
  height: ${pixelScaler(45)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ServicePolicy = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>서비스 방침</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  const onCompleted = (data: any) => {
    console.log(data);
    if (data?.deleteAccount?.ok) {
      logUserOut();
    } else {
      Alert.alert(
        "",
        "회원탈퇴에 실패했습니다.\n문제가 계속될 경우\ncontact@lunen.co.kr로 문의 부탁드립니다."
      );
    }
  };

  const [mutation, { loading }] = useMutation(DELETE_ACCOUNT, { onCompleted });

  return (
    <ScreenContainer>
      <View style={{ height: pixelScaler(10) }} />
      <ButtonContainer
        onPress={() =>
          Linking.openURL("https://static.splace.co.kr/terms-of-use.html")
        }
      >
        <RegText16>이용 약관</RegText16>

        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
      <ButtonContainer
        onPress={() =>
          Linking.openURL("https://static.splace.co.kr/privacy-policy.html")
        }
      >
        <RegText16>3자 개인정보 제공 동의</RegText16>
        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
      <ButtonContainer
        onPress={() => {
          Alert.alert(
            "계정 탈퇴",
            "splace 계정을 삭제하시겠습니까? 삭제된 계정은 복구할 수 없습니다.",
            [
              {
                text: "확인",
                onPress: () => {
                  if (!loading) {
                    mutation();
                  }
                },
              },
              {
                text: "취소",
                style: "cancel",
              },
            ]
          );
        }}
      >
        <RegText16>회원 탈퇴</RegText16>
        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
    </ScreenContainer>
  );
};

export default ServicePolicy;
