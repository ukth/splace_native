import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert, Switch, useWindowDimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useMutation } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, ThemeType } from "../types";
import { RegTextInput13 } from "../components/TextInput";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { HeaderRightConfirm } from "../components/HeaderRightConfirm";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { REPORT } from "../queries";
import { ProgressContext } from "../contexts/Progress";
import { BldText16 } from "../components/Text";

const Container = styled.View`
  flex: 1;
  padding: ${pixelScaler(15)}px ${pixelScaler(30)}px;
`;

const LabelContainer = styled.TouchableOpacity`
  flex-direction: row;
  height: ${pixelScaler(60)}px;
  align-items: center;
  justify-content: space-between;
  border-top-width: ${pixelScaler(0.67)}px;
  border-top-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const EditPhotolog = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { photolog } =
    useRoute<RouteProp<StackGeneratorParamList, "EditPhotolog">>().params;

  const theme = useContext<ThemeType>(ThemeContext);
  const [reason, setReason] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const onCompleted = (data: any) => {
    console.log(data);
    if (data?.reportResources?.ok) {
      Alert.alert("신고가 접수되었습니다.\n검토에 24-72시간이 소요됩니다.");
      navigation.pop();
    } else {
      Alert.alert(
        "신고에 실패했습니다.\n별도의 문의사항이 있는 경우\ncontact@lunen.co.kr로 문의 바랍니다."
      );
    }

    spinner.stop();
  };

  const [mutation, { loading }] = useMutation(REPORT, { onCompleted });

  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    navigation.setOptions({
      title: "신고",
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (reason.length < 10) {
              Alert.alert("10자 이상의 사유를 입력해주세요.");
            } else if (!loading) {
              spinner.start();
              mutation({
                variables: {},
              });
            }
          }}
        />
      ),
    });
  }, [reason]);

  return (
    <ScreenContainer>
      <Container>
        <LabelContainer>
          <BldText16>비공개</BldText16>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={isPrivate}
            onValueChange={(value) => setIsPrivate(value)}
          />
        </LabelContainer>
        <RegTextInput13
          onChangeText={(text) => setReason(text)}
          placeholder="텍스트 작성"
          selectionColor={theme.chatSelection}
          placeholderTextColor={theme.greyText}
        />
      </Container>
    </ScreenContainer>
  );
};

export default EditPhotolog;
