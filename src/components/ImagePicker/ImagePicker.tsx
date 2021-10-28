import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  Image,
  ScrollView,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { HeaderBackButton } from "../HeaderBackButton";
import { HeaderRightConfirm } from "../HeaderRightConfirm";
import { BldText16 } from "../Text";
import { ZoomableImage } from "./ZoomableImageComponent";
import * as MediaLibrary from "expo-media-library";

const Container = styled.SafeAreaView``;

const PickerContianer = styled.View`
  padding: ${pixelScaler(30)}px ${pixelScaler(30)}px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-top: ${pixelScaler(30)}px;
`;

const ImagePicker = ({
  setURLs,
  multiple,
  type,
  showPicker,
  setShowPicker,
}: {
  setURLs: (_: string[]) => void;
  multiple: boolean;
  type: "ProfileImage" | "SplaceThumbnail" | "Menu" | "Photolog";
  showPicker: boolean;
  setShowPicker: (_: boolean) => void;
}) => {
  const screenHeight = Dimensions.get("screen").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const theme = useContext<ThemeType>(ThemeContext);

  useEffect(() => {
    if (showPicker) {
      resetBottomSheet.start();
    }
  }, [showPicker]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowPicker(false);
    });
  };

  const [size, setSize] = useState<{ width: number; height: number }>();
  useEffect(() => {
    Image.getSize(
      "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
      (img_w, img_h) => {
        if (img_w > img_h) {
          // console.log("1@@@@", {
          //   width: (img_w / img_h) * pixelScaler(315),
          //   height: pixelScaler(315),
          // });
          setSize({
            width: (img_w / img_h) * pixelScaler(315),
            height: pixelScaler(315),
          });
        } else {
          setSize({
            width: pixelScaler(315),
            height: (img_h / img_w) * pixelScaler(315),
          });
        }
      }
    );
    (async () => {
      const albums = await MediaLibrary.getAlbumsAsync();
      console.log(albums);
    })();
    console.log(size);
  }, []);

  return (
    <Animated.View
      style={{
        backgroundColor: theme.background,
        transform: [{ translateY: translateY }],
        position: "absolute",
      }}
    >
      <Container style={{ height: screenHeight }}>
        <Header>
          <HeaderBackButton onPress={() => closeModal()} />
          <BldText16>앨범 이름</BldText16>
          <HeaderRightConfirm onPress={() => {}} />
        </Header>
        <PickerContianer>
          <View>
            <ScrollView
              style={{
                borderRadius: pixelScaler(15),
                width: pixelScaler(315),
                height: pixelScaler(315),
              }}
              scrollEnabled={false}
            >
              {size && (
                <ZoomableImage
                  imageHeight={size.height}
                  imageWidth={size.width}
                  frameWidth={pixelScaler(315)}
                  frameHeight={pixelScaler(315)}
                  uri="https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg"
                />
              )}
            </ScrollView>
          </View>
        </PickerContianer>
      </Container>
    </Animated.View>
  );
};

export default ImagePicker;
