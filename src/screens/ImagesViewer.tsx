import React, { useState, useEffect, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, ThemeType } from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { Image, SafeAreaView, useWindowDimensions } from "react-native";
import { pixelScaler } from "../utils";
import ImageViewer from "react-native-image-zoom-viewer";
import { RegText13 } from "../components/Text";
import { Icon } from "../components/Icon";

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  left: ${pixelScaler(27)}px;

  z-index: 1;
`;

const ImagesViewer = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const theme = useContext<ThemeType>(ThemeContext);
  const { urls } =
    useRoute<RouteProp<StackGeneratorParamList, "ImagesViewer">>().params;
  const [imageIndex, setImageIndex] = useState(0);

  const [images, setImages] = useState<{ url: string; height: number }[]>(
    urls.map((url) => {
      return { url, height: 0 };
    }) ?? []
  );

  useEffect(() => {
    if (images.filter((image) => image.height === 0).length > 0) {
      const tmp = [...images];
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i].height === 0) {
          Image.getSize(tmp[i].url, (img_w, img_h) => {
            const h = (img_h / img_w) * pixelScaler(375);
            tmp[i].height = h;
            setImages(tmp);
          });
          break;
        }
      }
    }
  }, [images]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: theme.black,
        height: pixelScaler(95),
        shadowOpacity: 0,
      },
      headerLeft: () => (
        <CloseButton
          onPress={() => navigation.pop()}
          hitSlop={{
            top: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
            bottom: pixelScaler(10),
          }}
        >
          <Icon
            name="close_white"
            style={{ width: pixelScaler(11), height: pixelScaler(11) }}
          />
        </CloseButton>
      ),
      headerRight: () => (
        <RegText13
          style={{
            position: "absolute",
            right: pixelScaler(30),
            top: pixelScaler(24),
            color: theme.white,
          }}
        >
          {imageIndex + 1}/{images.length}
        </RegText13>
      ),
    });
  }, [imageIndex]);

  return (
    <ScreenContainer
      style={{
        backgroundColor: theme.imageViewerBackground,
        justifyContent: "center",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ImageViewer
          renderIndicator={(currentIndex, allSize) => <></>}
          imageUrls={images}
          onChange={(index) => {
            if (index) {
              setImageIndex(index);
            }
          }}
        />
      </SafeAreaView>
    </ScreenContainer>
  );
};

export default ImagesViewer;
