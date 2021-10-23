import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  ScrollView,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { pixelScaler } from "../../utils";
import { RegText13, RegText33 } from "../Text";

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
`;

const PickerContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
  padding-top: ${pixelScaler(30)}px;
`;

const pointsDistance = ([xA, yA], [xB, yB]) => {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2));
};

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
  // const screenHeight = Dimensions.get("screen").height;
  // const panY = useRef(new Animated.Value(screenHeight)).current;
  const [zoomScale, setZoomScale] = useState(1);

  const dimensions = useWindowDimensions();

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const scale = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: (evt, gestureState) => {},
      onPanResponderMove: (evt, gestureState) => {
        let touches = evt.nativeEvent.touches;
        console.log(touches);
      },

      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {},
      onPanResponderTerminate: (evt, gestureState) => {},
      onShouldBlockNativeResponder: (evt, gestureState) => true,
    })
  ).current;

  useEffect(() => {
    // setZoomScale(4);
  });

  return (
    <Modal
      visible={showPicker}
      animationType={"slide"}
      transparent
      statusBarTranslucent
    >
      <Container>
        <Header>
          <TouchableOpacity
            onPress={() => setShowPicker(false)}
            style={{ backgroundColor: "#8090f0" }}
          >
            <View style={{ width: 100, height: 50 }}></View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setZoomScale(zoomScale + 0.1)}
            style={{ backgroundColor: "#f090f0" }}
          >
            <View style={{ width: 100, height: 50 }}></View>
          </TouchableOpacity>
        </Header>
        <PickerContainer>
          <ScrollView
            style={{
              borderRadius: pixelScaler(15),
              width: pixelScaler(315),
              height: pixelScaler(315),
            }}
            maximumZoomScale={2.5}
            minimumZoomScale={0.7}
            // onScroll={(e) => console.log(e.nativeEvent)}
            // onScrollEndDrag={(e) => console.log(e.nativeEvent)}
            zoomScale={zoomScale}
          >
            <Image
              source={{
                uri: "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
              }}
              style={{ width: 400, height: pixelScaler(315) }}
            />
          </ScrollView>
          <Animated.Image
            {...panResponder.panHandlers}
            source={{
              uri: "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
            }}
            style={{
              height: 300,
              width: "90%",
              borderRadius: 10,
              transform: [
                // or pan.getTranslateTransform()
                { translateX: pan.x },
                { translateY: pan.y },
                { scale },
              ],
            }}
          />
        </PickerContainer>
      </Container>
    </Modal>
  );
};

export default ImagePicker;
