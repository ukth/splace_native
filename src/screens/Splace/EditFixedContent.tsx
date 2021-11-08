import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  FixedContentType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler, uploadPhotos } from "../../utils";
import { BldText16, RegText13 } from "../../components/Text";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { ImagePickerContext } from "../../contexts/ImagePicker";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16, RegTextInput13 } from "../../components/TextInput";
import { CREATE_CONTENT, EDIT_CONTENT } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";
import { exp } from "react-native-reanimated";

const ImageItemContainer = styled.View`
  height: ${pixelScaler(100)}px;
  /* bottom: 0; */
`;

const SelectImageButton = styled.TouchableOpacity`
  position: absolute;
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(100)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(10)}px;
  border-width: ${pixelScaler(1.67)}px;
`;

const TitleContainer = styled.View`
  margin-left: ${pixelScaler(30)}px;
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(60)}px;
  justify-content: center;
  border-top-width: ${pixelScaler(0.67)}px;
  border-top-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;
const TextContainer = styled.View`
  margin-left: ${pixelScaler(30)}px;
  width: ${pixelScaler(315)}px;
  border-top-width: ${pixelScaler(0.67)}px;
  border-top-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
  padding-right: ${pixelScaler(30)}px;
`;

const EditFixedContents = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const {
    fixedContent,
    splaceId,
  }: {
    fixedContent: FixedContentType;
    splaceId: number;
  } =
    useRoute<RouteProp<StackGeneratorParamList, "EditFixedContents">>().params;
  const [title, setTitle] = useState(fixedContent.title);
  const [text, setText] = useState(fixedContent.text);

  const theme = useContext<ThemeType>(ThemeContext);
  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editContents?.ok) {
      Alert.alert("게시물이 수정되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("게시물 수정에 실패했습니다.", data?.editContents?.error);
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_CONTENT, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>안내 게시물 수정</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            if (title !== "") {
              spinner.start();

              mutation({
                variables: {
                  splaceId,
                  fixedContentId: fixedContent.id,
                  title,
                  text,
                },
              });
            } else {
              Alert.alert("제목은 필수항목입니다.");
            }
          }}
        />
      ),
    });
  }, [title, text]);

  return (
    <ScreenContainer>
      <TitleContainer>
        <BldTextInput16
          value={title}
          onChangeText={(text) => setTitle(text)}
          selectionColor={theme.chatSelection}
          style={{ width: pixelScaler(300) }}
          placeholder="게시물 제목"
          placeholderTextColor={theme.greyTextAlone}
          maxLength={50}
          multiline={true}
          numberOfLines={2}
        />
      </TitleContainer>
      <TextContainer>
        <RegTextInput13
          value={text}
          onChangeText={(text) => setText(text)}
          selectionColor={theme.chatSelection}
          style={{ width: pixelScaler(300), marginTop: pixelScaler(16) }}
          placeholder="텍스트 작성..."
          placeholderTextColor={theme.greyTextAlone}
          multiline={true}
          maxLength={1000}
          scrollEnabled={false}
        />
      </TextContainer>
    </ScreenContainer>
  );
};

export default EditFixedContents;
