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
import { pixelScaler, showFlashMessage } from "../utils";
import { EDIT_LOG, REPORT } from "../queries";
import { ProgressContext } from "../contexts/Progress";
import { BldText16 } from "../components/Text";

const Container = styled.View`
  flex: 1;
  padding: 0 ${pixelScaler(30)}px;
`;

const LabelContainer = styled.TouchableOpacity`
  flex-direction: row;
  height: ${pixelScaler(60)}px;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: ${pixelScaler(0.67)}px;
  border-bottom-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const EditPhotolog = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { photolog } =
    useRoute<RouteProp<StackGeneratorParamList, "EditPhotolog">>().params;

  const theme = useContext<ThemeType>(ThemeContext);
  const [logText, setLogText] = useState(photolog.text);
  const [isPrivate, setIsPrivate] = useState(photolog.isPrivate);

  const onCompleted = (data: any) => {
    if (data?.editPhotolog?.ok) {
      showFlashMessage({ message: "게시물이 수정되었습니다." });
      navigation.pop();
    } else {
      Alert.alert("게시물 수정에 실패했습니다.");
    }
    spinner.stop();
  };

  const [mutation, { loading }] = useMutation(EDIT_LOG, { onCompleted });

  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>편집모드</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            mutation({
              variables: {
                photologId: photolog.id,
                text: logText,
                isPrivate,
              },
            });
          }}
        />
      ),
    });
  }, [logText, isPrivate]);

  return (
    <ScreenContainer>
      <Container>
        <LabelContainer>
          <BldText16 style={{ marginTop: pixelScaler(4) }}>비공개</BldText16>
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
          style={{ marginTop: pixelScaler(15), lineHeight: pixelScaler(17) }}
          value={logText}
          onChangeText={(text) => setLogText(text)}
          placeholder="텍스트 작성"
          selectionColor={theme.chatSelection}
          placeholderTextColor={theme.greyText}
          autoCorrect={false}
          multiline={true}
        />
      </Container>
    </ScreenContainer>
  );
};

export default EditPhotolog;
