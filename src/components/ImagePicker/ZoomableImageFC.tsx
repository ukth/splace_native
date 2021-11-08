import React, { Component, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  PanResponderInstance,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { pixelScaler } from "../../utils";

const ZoomableImage = ({
  imageWidth,
  imageHeight,
  frameWidth,
  frameHeight,
  uri,
}: {
  imageWidth: number;
  imageHeight: number;
  frameWidth: number;
  frameHeight: number;
  uri: string;
}) => {
  const off_x: number =
    imageWidth > imageHeight ? (imageHeight - imageWidth) / 2 : 0;

  const off_y: number =
    imageHeight > imageWidth ? (imageWidth - imageHeight) / 2 : 0;

  const [zoom, setzoom] = useState<number>(1);
  const [offset_x, setoffset_x] = useState<number>(off_x);
  const [offset_y, setoffset_y] = useState<number>(off_y);
  const [isZooming, setisZooming] = useState<boolean>(false);
  const [isMoving, setisMoving] = useState<boolean>(false);
  const [initialZoom, setinitialZoom] = useState<number>(1);
  const [initialCenter_x, setinitialCenter_x] = useState<number>(0);
  const [initialCenter_y, setinitialCenter_y] = useState<number>(0);
  const [initialOffset_x, setinitialOffset_x] = useState<number>(off_x);
  const [initialOffset_y, setinitialOffset_y] = useState<number>(off_y);
  const [initialDistance, setinitialDistance] = useState<number>(1);
  const [initialX, setinitialX] = useState<number>(0);
  const [initialY, setinitialY] = useState<number>(0);

  const processPinch = (
    coord1: { x: number; y: number },
    coord2: { x: number; y: number }
  ) => {
    let distance = Math.sqrt(
      Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
    );
    let center = { x: (coord1.x + coord2.x) / 2, y: (coord1.y + coord2.y) / 2 };

    if (!isZooming) {
      setisZooming(true);
      setinitialZoom(zoom);
      setinitialOffset_x(offset_x);
      setinitialOffset_y(offset_y);
      setinitialCenter_x(center.x);
      setinitialCenter_y(center.y);
      setinitialDistance(distance);
    } else {
      let touchZoom = (initialZoom * distance) / initialDistance;
      touchZoom = touchZoom < 1 ? 1 : touchZoom;

      const offset_x =
        center.x - (initialCenter_x - initialOffset_x) * (zoom / initialZoom);

      const offset_y =
        center.y - (initialCenter_y - initialOffset_y) * (zoom / initialZoom);

      setzoom(touchZoom);
      setoffset_x(
        offset_x + imageWidth * zoom < frameWidth
          ? frameWidth - imageWidth * zoom
          : offset_x < 0
          ? offset_x
          : 0
      );
      setoffset_y(
        offset_y + imageHeight * zoom < frameHeight
          ? frameHeight - imageHeight * zoom
          : offset_y < 0
          ? offset_y
          : 0
      );
    }
  };

  const processTouch = (coord: { x: number; y: number }) => {
    if (!isMoving) {
      setisMoving(true);
      setinitialX(coord.x);
      setinitialY(coord.y);
      setinitialOffset_x(offset_x);
      setinitialOffset_y(offset_y);
    } else {
      const offset_x = coord.x - (initialX - initialOffset_x);
      const offset_y = coord.y - (initialY - initialOffset_y);

      setoffset_x(
        offset_x + imageWidth * zoom < frameWidth
          ? frameWidth - imageWidth * zoom
          : offset_x < 0
          ? offset_x
          : 0
      );
      setoffset_y(
        offset_y + imageHeight * zoom < frameHeight
          ? frameHeight - imageHeight * zoom
          : offset_y < 0
          ? offset_y
          : 0
      );
    }
  };

  const _panResponder = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      let touches = evt.nativeEvent.touches;
      if (touches.length == 2) {
        processPinch(
          { x: touches[0].pageX, y: touches[0].pageY },
          { x: touches[1].pageX, y: touches[1].pageY }
        );
      } else if (touches.length == 1) {
        if (isZooming) {
          setisZooming(false);
        }
        processTouch({ x: touches[0].pageX, y: touches[0].pageY });
      }
    },

    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      setisZooming(false);
      setisMoving(false);
    },
    onShouldBlockNativeResponder: (evt, gestureState) => true,
  });

  return (
    <View
      style={{
        width: frameWidth,
        height: frameHeight,
        backgroundColor: "#e0f0f0",
      }}
      {..._panResponder.panHandlers}
    >
      <Image
        style={{
          position: "absolute",
          left: offset_x,
          top: offset_y,
          width: imageWidth * zoom,
          height: imageHeight * zoom,
        }}
        source={{
          uri: uri,
        }}
      />
    </View>
  );
};

export default ZoomableImage;

// const Market = ({ navigation }: { navigation: any }) => {
//   const [size, setSize] = useState<{ width: number; height: number }>();
//   useEffect(() => {
//     Image.getSize(
//       "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
//       (img_w, img_h) => {
//         if (img_w > img_h) {
//           setSize({
//             width: (img_w / img_h) * pixelScaler(315),
//             height: pixelScaler(315),
//           });
//         } else {
//           setSize({
//             width: pixelScaler(315),
//             height: (img_h / img_w) * pixelScaler(315),
//           });
//         }
//       }
//     );
//   }, []);
//   return (
//     <ZoomableImage
//       imageHeight={size.height}
//       imageWidth={size.width}
//       frameWidth={pixelScaler(315)}
//       frameHeight={pixelScaler(315)}
//       uri="https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg"
//     />
//   );
// };

// export default Market;
