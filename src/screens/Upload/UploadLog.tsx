import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { pixelScaler, showFlashMessage, uploadPhotos } from "../../utils";
import { ImagePickerContext } from "../../contexts/ImagePicker";
import { ProgressContext } from "../../contexts/Progress";
import useMe from "../../hooks/useMe";
import { Alert, FlatList, Image, Switch, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BldText16, RegText13 } from "../../components/Text";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { RegTextInput13 } from "../../components/TextInput";
import { UploadContentContext } from "../../contexts/UploadContent";
import { LinearGradient } from "expo-linear-gradient";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { CREATE_LOG } from "../../queries";
import RatingModal from "./RatingModal";
import { Icon } from "../../components/Icon";

const LabelsContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
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

const TagsContainer = styled.View`
  flex-direction: row;
  width: ${pixelScaler(280)}px;
  overflow: hidden;
`;

const TextInputContainer = styled.View`
  padding-top: ${pixelScaler(16)}px;
  border-top-width: ${pixelScaler(0.67)}px;
  border-top-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const ImageListContainer = styled.View`
  height: ${pixelScaler(160)}px;
`;

const ImageItemContainer = styled.View`
  margin-top: ${pixelScaler(18)}px;
  height: ${pixelScaler(112)}px;
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

const Tag = styled.View`
  height: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(15)}px;
  border-width: ${pixelScaler(0.67)}px;
  margin-right: ${pixelScaler(10)}px;
`;

const UploadLog = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const [isPrivate, setIsPrivate] = useState(false);

  const { setShowPicker, images, setImages, imageSize } =
    useContext(ImagePickerContext);
  const { spinner } = useContext(ProgressContext);
  const theme = useContext<ThemeType>(ThemeContext);

  const { content, setContent } = useContext(UploadContentContext);
  const [logText, setLogText] = useState("");
  const [showRating, setShowRating] = useState(false);

  const me = useMe();

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.uploadLog?.ok) {
      showFlashMessage({ message: "게시물이 업로드되었습니다." });
      if (content?.splace) {
        setShowRating(true);
      } else {
        navigation.pop();
      }
    } else {
      console.log(data);
      Alert.alert("업로드에 실패했습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(CREATE_LOG, { onCompleted });
  useEffect(() => {
    setImages([]);
    setContent({});
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => <BldText16>새 로그 만들기</BldText16>,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        images.length ? (
          <HeaderRightConfirm
            onPress={async () => {
              if (!loading && images.length) {
                spinner.start();
                const awsUrls = await uploadPhotos(
                  images.map((image) => image.url)
                );
                mutation({
                  variables: {
                    imageUrls: awsUrls,
                    photoSize: imageSize,
                    text: logText,
                    seriesIds: content.series?.map((series) => series.id) ?? [],
                    categories: content.category ?? [],
                    bigCategoryIds:
                      content.bigCategory?.map(
                        (bigCategory) => bigCategory.id
                      ) ?? [],
                    isPrivate,
                    ...(content.splace ? { splaceId: content.splace.id } : {}),
                  },
                });
              }
            }}
          />
        ) : null,
    });
    // console.log(content.splace);
  }, [isPrivate, content, logText, images]);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView extraScrollHeight={50}>
        <ImageListContainer>
          <FlatList
            style={{
              height: pixelScaler(160),
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
                    imageSize === 0 ? 143.3 : imageSize === 1 ? 110 : 85
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
                <MinusButton
                  onPress={() => {
                    const tmp = [...images];
                    setImages(tmp.filter((image) => image.url !== item.url));
                  }}
                >
                  <MinusBar />
                </MinusButton>
              </ImageItemContainer>
            )}
            keyExtractor={(item, index) => index + ""}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </ImageListContainer>
        <LabelsContainer>
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
          <LabelContainer
            onPress={() =>
              navigation.push("SearchSplaceForUpload", {
                listHeaderRightText: "새로운 장소/이벤트 제안",
                onListHeaderRightPress: () =>
                  navigation.push("SuggestNewSplace", {
                    onConfirm: (splace: SplaceType) => {
                      setContent({ ...content, splace });
                      navigation.navigate("UploadLog");
                    },
                  }),
                rootScreen: "UploadLog",
              })
            }
          >
            <BldText16 numberOfLines={1}>
              {content?.splace?.name.length
                ? content?.splace?.name
                : "장소 / 이벤트 선택"}
            </BldText16>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelContainer>
          <LabelContainer
            onPress={() => {
              navigation.push("SelectSeries");
            }}
          >
            {content?.series?.length ? (
              <TagsContainer>
                {content?.series?.map((series) => (
                  <Tag key={series.id}>
                    <RegText13>{series.title}</RegText13>
                  </Tag>
                ))}
              </TagsContainer>
            ) : (
              <BldText16>시리즈 선택</BldText16>
            )}
            {content?.series?.length || content.series?.length ? (
              <LinearGradient
                // Background Linear Gradient
                start={[0, 1]}
                end={[1, 0]}
                colors={["rgba(255,255,255,0)", "white"]}
                style={{
                  top: 0,
                  position: "absolute",
                  height: pixelScaler(40),
                  width: pixelScaler(pixelScaler(280)),
                  zIndex: 3,
                }}
              />
            ) : null}
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelContainer>
          <LabelContainer
            onPress={() => {
              navigation.push("SelectCategory");
            }}
          >
            {content?.bigCategory?.length || content.category?.length ? (
              <TagsContainer>
                {content?.bigCategory?.map((category) => (
                  <Tag key={category.id + "big"}>
                    <RegText13>{category.name}</RegText13>
                  </Tag>
                ))}
                {content?.category?.map((category) => (
                  <Tag key={category}>
                    <RegText13>{category}</RegText13>
                  </Tag>
                ))}
              </TagsContainer>
            ) : (
              <BldText16>카테고리 선택</BldText16>
            )}
            {content?.bigCategory?.length || content.category?.length ? (
              <LinearGradient
                // Background Linear Gradient
                start={[0, 1]}
                end={[1, 0]}
                colors={["rgba(255,255,255,0)", "white"]}
                style={{
                  top: 0,
                  position: "absolute",
                  height: pixelScaler(40),
                  width: pixelScaler(pixelScaler(280)),
                  zIndex: 3,
                }}
              />
            ) : null}
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelContainer>
          <TextInputContainer>
            <RegTextInput13
              placeholder="텍스트 작성..."
              selectionColor={theme.entrySelection}
              placeholderTextColor={theme.greyTextAlone}
              maxLength={2000}
              multiline={true}
              numberOfLines={2}
              autoCorrect={false}
              value={logText}
              onChangeText={(text) => setLogText(text)}
            />
          </TextInputContainer>
        </LabelsContainer>
      </KeyboardAwareScrollView>
      {content.splace ? (
        <RatingModal
          modalVisible={showRating}
          setModalVisible={setShowRating}
          onConfirm={() => navigation.pop()}
          splace={content.splace}
        />
      ) : null}
    </ScreenContainer>
  );
};

export default UploadLog;
