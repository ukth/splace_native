import React, { useState, useEffect, useRef, useContext } from "react";
import { Alert, useWindowDimensions } from "react-native";
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
  padding: ${pixelScaler(25)}px ${pixelScaler(30)}px;
`;

const Report = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const route = useRoute<RouteProp<StackGeneratorParamList, "Report">>();

  const theme = useContext<ThemeType>(ThemeContext);
  const [reason, setReason] = useState("");

  const onCompleted = (data: any) => {
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
      headerTitle: () => <BldText16>신고</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (reason.length < 10) {
              Alert.alert("10자 이상의 사유를 입력해주세요.");
            } else if (!loading) {
              spinner.start();
              mutation({
                variables: {
                  sourceType: route.params.type,
                  sourceId: route.params.id,
                  reason,
                },
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
        <RegTextInput13
          onChangeText={(text) => setReason(text)}
          placeholder="신고 사유를 입력하세요"
          selectionColor={theme.chatSelection}
          placeholderTextColor={theme.greyText}
        />
      </Container>
    </ScreenContainer>
  );
};

export default Report;
