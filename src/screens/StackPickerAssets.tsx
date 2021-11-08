import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  FlatList,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../types";
import { AlbumTitleKor, BLANK_IMAGE, pixelScaler } from "../utils";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { HeaderRightConfirm } from "../components/HeaderRightConfirm";
import { BldText13, BldText16, RegText13, RegText16 } from "../components/Text";
import { ZoomableImage } from "../components/ImagePicker/ZoomableImageComponent";
import ScreenContainer from "../components/ScreenContainer";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ImagePickerContext } from "../contexts/ImagePicker";
import { Icons } from "../icons";
import * as MediaLibrary from "expo-media-library";
import { manipulateAsync } from "expo-image-manipulator";
import { ProgressContext } from "../contexts/Progress";

const PickerContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
  padding-top: ${pixelScaler(30)}px;
  height: ${pixelScaler(410)}px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  position: absolute;
  bottom: ${pixelScaler(20)}px;
  left: ${pixelScaler(30)}px;
  width: ${pixelScaler(315)}px;
`;

const ImageContainer = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(315)}px;
  align-items: center;
  justify-content: center;
`;

const SizeButtonsContainer = styled.View`
  flex-direction: row;
`;

const Button = styled.TouchableOpacity`
  height: ${pixelScaler(25)}px;
  border-width: ${pixelScaler(0.67)}px;
  padding: 0 ${pixelScaler(10)}px;
  justify-content: center;
  border-radius: ${pixelScaler(25)}px;
`;

const AlbumContainer = styled.TouchableOpacity`
  height: ${pixelScaler(75)}px;
  padding: 0 ${pixelScaler(30)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AlbumThumbnail = styled.Image`
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-right: ${pixelScaler(15)}px;
`;

const AlbumInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  margin-left: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const ImageItemContainer = styled.TouchableOpacity`
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const ImageItem = styled.Image`
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
`;

const ImageItemFocused = styled.View`
  position: absolute;
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const NumberLabelContainer = styled.View`
  width: ${pixelScaler(20)}px;
  height: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${pixelScaler(10)}px;
  right: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
`;

const NumberLabel = ({ urls, url }: { urls: string[]; url: string }) => {
  const idx = urls.indexOf(url);
  const theme = useContext<ThemeType>(ThemeContext);
  return idx !== -1 ? (
    <NumberLabelContainer>
      <BldText13 style={{ color: theme.background }}>{idx + 1}</BldText13>
    </NumberLabelContainer>
  ) : null;
};

type AlbumType = {
  title: string;
  id: string;
  count: number;
  thumbnail: string;
};

const StackPickerAssets = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const [focusedImageIndex, setFocusedImageIndex] = useState(0);

  const flatListRef = useRef<any>();

  const [loadedImage, setLoadedImage] = useState<MediaLibrary.Asset[]>([]);

  const { rootScreen, params, album } =
    useRoute<RouteProp<StackGeneratorParamList, "StackPickerAssets">>().params;

  const { images, setImages } = useContext(ImagePickerContext);
  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            navigation.navigate(rootScreen, { params });
          }}
        />
      ),
      headerTitle: () => <BldText16>사진 선택</BldText16>,
    });
    if (album) {
      (async () => {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 30,
        });
        setLoadedImage(assets.assets);
      })();
    }
  }, []);

  const fetchLoadImage = () => {
    if (album) {
      (async () => {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 50,
          after: loadedImage[loadedImage.length - 1].id,
        });
        setLoadedImage([...loadedImage, ...assets.assets]);
      })();
    }
  };

  return (
    <ScreenContainer>
      <FlatList
        ref={flatListRef}
        data={loadedImage}
        renderItem={({
          item,
          index,
        }: {
          item: MediaLibrary.Asset;
          index: number;
        }) => (
          <ImageItemContainer
            key={index}
            onPress={() => {
              const imageUrls = images.map((image) => image.url);
              const ind = imageUrls.indexOf(item.uri);
              if (ind === -1 && images.length < 5) {
                const tmp = images;
                setImages([
                  ...tmp,
                  {
                    edited: false,
                    url: item.uri,
                    orgUrl: item.uri,
                  },
                ]);
                setFocusedImageIndex(tmp.length);
              } else {
                if (images[focusedImageIndex].url === item.uri) {
                  if (images.length > 1) {
                    setFocusedImageIndex(images.length - 2);
                    const tmp = [...images];
                    tmp.splice(ind, 1);
                    setImages(tmp);
                  } else if (images.length === 1) {
                    setImages([]);
                  }
                } else {
                  setFocusedImageIndex(imageUrls.indexOf(item.uri));
                }
              }
            }}
          >
            <ImageItem source={{ uri: item.uri }} />
            {images[focusedImageIndex]?.url === item.uri ? (
              <ImageItemFocused />
            ) : null}
            {
              <NumberLabel
                urls={images.map((image) => image.url)}
                url={item.uri}
              />
            }
          </ImageItemContainer>
        )}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        onEndReached={fetchLoadImage}
        onEndReachedThreshold={2}
      />
    </ScreenContainer>
  );
};

export default StackPickerAssets;
