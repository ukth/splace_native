import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { BldText16, RegText13 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { pixelScaler } from "../../utils";
import { RegTextInput13, RegTextInput16 } from "../../components/TextInput";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { Alert, Keyboard, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { EDIT_SPLACE } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";

const EditSplaceIntro = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceIntro">>().params;

  const [intro, setIntro] = useState(splace.intro);
  const theme = useContext<ThemeType>(ThemeContext);

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editSplaces?.ok) {
      Alert.alert("소개글이 변경되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("소개글을 변경할 수 없습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>소개글 작성</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            if (!loading) {
              spinner.start();
              mutation({
                variables: {
                  splaceId: splace.id,
                  intro,
                },
              });
            }
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [intro]);

  return (
    <ScreenContainer
      style={{
        paddingHorizontal: pixelScaler(30),
        paddingTop: pixelScaler(20),
      }}
    >
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ width: "100%", height: "100%" }}>
          <RegTextInput13
            value={intro}
            style={{
              width: pixelScaler(315),
              lineHeight: pixelScaler(17),
            }}
            placeholder="이 공간에 대한 소개글을 작성해주세요(최대 500자)."
            autoCorrect={false}
            placeholderTextColor={theme.entryPlaceholder}
            maxLength={500}
            selectionColor={theme.chatSelection}
            multiline={true}
            // numberOfLines={5}
            onChangeText={(text) => setIntro(text)}
            onBlur={() => Keyboard.dismiss()}
          />
        </View>
      </TouchableWithoutFeedback>
    </ScreenContainer>
  );
};

export default EditSplaceIntro;
