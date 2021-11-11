import React, { useState, useEffect, useRef } from "react";
import { Alert, useWindowDimensions, View } from "react-native";
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
import { logUserOut } from "../../apollo";
import { Icon } from "../../components/Icon";

const ButtonContainer = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(30)}px;
  height: ${pixelScaler(45)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Setting = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  // const route = useRoute<RouteProp<StackGeneratorParamList, "Setting">>();

  // const [mutation, { loading }] = useMutation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>환경설정</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  return (
    <ScreenContainer>
      <View style={{ height: pixelScaler(10) }} />
      <ButtonContainer onPress={() => navigation.push("EditInfo")}>
        <RegText16>개인 정보</RegText16>
        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
      <ButtonContainer onPress={() => navigation.push("ChangePassword")}>
        <RegText16>비밀번호 변경</RegText16>
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
          navigation.push("Report", { type: "problem", id: undefined })
        }
      >
        <RegText16>문제 신고</RegText16>
        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
      <ButtonContainer onPress={() => navigation.push("BlockedUsers")}>
        <RegText16>차단된 계정</RegText16>
        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
      <ButtonContainer onPress={() => navigation.push("ServicePolicy")}>
        <RegText16>서비스 방침</RegText16>
        <Icon
          name="arrow_right"
          style={{
            width: pixelScaler(6),
            height: pixelScaler(12),
          }}
        />
      </ButtonContainer>
      <ButtonContainer
        onPress={async () => {
          Alert.alert("로그아웃 하시겠습니까?", "", [
            {
              text: "취소",
              style: "cancel",
            },
            {
              text: "확인",
              onPress: async () => await logUserOut(),
            },
          ]);
        }}
      >
        <RegText16>로그아웃</RegText16>
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

export default Setting;
