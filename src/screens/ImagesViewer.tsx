import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, ThemeType } from "../types";
import styled, { ThemeContext } from "styled-components/native";
import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { ZoomableImage } from "../components/ImagePicker/ZoomableImageComponent";
import ImageZoom from "react-native-image-pan-zoom";
import { pixelScaler } from "../utils";
import ImageViewer from "react-native-image-zoom-viewer";
import { RegText13 } from "../components/Text";
import { Icons } from "../icons";

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  left: ${pixelScaler(30)}px;
  top: ${pixelScaler(70)}px;
  z-index: 1;
`;

const ImagesViewer = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const theme = useContext<ThemeType>(ThemeContext);
  const { urls } =
    useRoute<RouteProp<StackGeneratorParamList, "ImagesViewer">>().params;
  const [index, setIndex] = useState(0);

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

  const { width, height } = useWindowDimensions();

  return (
    <ScreenContainer
      style={{
        backgroundColor: theme.imageViewerBackground,
        justifyContent: "center",
      }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <CloseButton
          onPress={() => navigation.pop()}
          hitSlop={{
            top: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
            bottom: pixelScaler(10),
          }}
        >
          <Image source={Icons.close_white} />
        </CloseButton>

        <ImageViewer
          renderIndicator={(currentIndex, allSize) =>
            allSize && allSize > 1 ? (
              <RegText13
                style={{
                  position: "absolute",
                  right: pixelScaler(30),
                  top: pixelScaler(24),
                  color: theme.white,
                }}
              >
                {currentIndex}/{allSize}
              </RegText13>
            ) : (
              <></>
            )
          }
          imageUrls={images}
        />
      </SafeAreaView>
    </ScreenContainer>
  );
};

export default ImagesViewer;
