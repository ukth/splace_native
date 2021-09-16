import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import QRCode from "react-native-qrcode-svg";
import ImageZoom from "react-native-image-pan-zoom";
import { Dimensions } from "react-native";
import { pixelScaler } from "../utils";
import styled from "styled-components/native";
import { RegText13 } from "../components/Text";
import { useNavigation } from "@react-navigation/core";
import { Video } from "expo-av";

const Container = styled.View`
  flex: 1;
  background-color: #000000;
  justify-content: center;
  align-items: center;
`;

const Moment = () => {
  const navigation = useNavigation();

  const video = useRef(null);
  const [status, setStatus] = useState<{ isPlaying: boolean }>({
    isPlaying: false,
  });

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    navigation.dangerouslyGetParent()?.setOptions({
      tabBarVisible: false,
    });
    // console.log("refetch!", messageData?.getRoomMessages?.messages.length);
    // if (video.current) {
    //   video.current.playAsync();
    // }
  }, []);

  return (
    <Container>
      <Video
        ref={video}
        style={{
          width,
          height,
        }}
        source={{
          uri: "https://splace-test.s3.ap-northeast-2.amazonaws.com/test2.mp4",
        }}
        resizeMode="contain"
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </Container>
  );
};

export default Moment;
