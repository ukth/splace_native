import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
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
import { CREATE_CONTENT } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";
import { exp } from "react-native-reanimated";
import { Icon } from "../../components/Icon";

const MinusButton = styled.TouchableOpacity`
  width: ${pixelScaler(25)}px;
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  position: absolute;
  top: 0;
  right: 0;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.greyButton};
`;

const MinusBar = styled.View`
  width: ${pixelScaler(11)}px;
  height: ${pixelScaler(2)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.text};
`;

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

const AddFixedContents = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceCategory">>().params;
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  const { setShowPicker, images, setImages, imageSize } =
    useContext(ImagePickerContext);

  const theme = useContext<ThemeType>(ThemeContext);
  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.createContents?.ok) {
      Alert.alert("게시물이 업로드되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("게시물 업로드에 실패했습니다.", data?.createContents?.error);
    }
  };

  const [mutation, { loading }] = useMutation(CREATE_CONTENT, { onCompleted });

  useEffect(() => {
    setImages([]);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>새 안내 게시물 올리기</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            if (images.length !== 0 && title) {
              spinner.start();
              const awsUrls = await uploadPhotos(
                images.map((image) => image.url)
              );
              setImages([]);
              if (awsUrls.length === images.length) {
                mutation({
                  variables: {
                    splaceId: splace.id,
                    title,
                    text,
                    imageUrls: awsUrls,
                    photoSize: imageSize,
                  },
                });
              } else {
                Alert.alert("업로드에 실패했습니다.");
                spinner.stop();
                return;
              }
            } else {
              Alert.alert("제목과 사진은 필수항목입니다.");
            }
          }}
        />
      ),
    });
  }, [title, text, images]);

  return (
    <ScreenContainer>
      <ScrollView>
        <View>
          <FlatList
            style={{
              marginBottom: pixelScaler(30),
              marginTop: pixelScaler(30),
            }}
            data={images}
            ListHeaderComponent={
              <ImageItemContainer
                style={{
                  marginLeft: pixelScaler(30),
                  width: pixelScaler(110),
                }}
              >
                <SelectImageButton
                  style={{ position: "absolute", bottom: 0 }}
                  onPress={() => setShowPicker(true)}
                >
                  <Icon
                    name="gallery_black"
                    style={{
                      zIndex: 1,
                      width: pixelScaler(25),
                      height: pixelScaler(20),
                    }}
                  />
                </SelectImageButton>
              </ImageItemContainer>
            }
            renderItem={({ item }) => (
              <ImageItemContainer
                style={{
                  width: pixelScaler(
                    imageSize === 0 ? 133.3 : imageSize === 1 ? 100 : 75
                  ),
                }}
              >
                <Image
                  source={{ uri: item.url }}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: pixelScaler(100),
                    width: pixelScaler(
                      imageSize === 0 ? 133.3 : imageSize === 1 ? 100 : 75
                    ),
                    borderRadius: pixelScaler(10),
                  }}
                />
              </ImageItemContainer>
            )}
            keyExtractor={(item, index) => index + ""}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={<View style={{ width: pixelScaler(50) }} />}
            ItemSeparatorComponent={() => (
              <View
                style={{ width: pixelScaler(10), height: pixelScaler(10) }}
              />
            )}
          />
        </View>
        <TitleContainer>
          <BldTextInput16
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
        <View style={{ height: pixelScaler(210) }} />
      </ScrollView>
    </ScreenContainer>
  );
};

export default AddFixedContents;
