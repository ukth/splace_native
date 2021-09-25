import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
} from "react-native";
import { pixelScaler } from "../utils";
import styled from "styled-components/native";
import { RegText13, RegText20 } from "../components/Text";
import { useNavigation } from "@react-navigation/core";
import { AVPlaybackStatus, Video } from "expo-av";
import { ScreenBackButton } from "../components/ScreenBackButton";
import { Ionicons } from "@expo/vector-icons";
import ThreeDots from "../components/ThreeDots";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const Container = styled.View`
  flex: 1;
  background-color: #000000;
  justify-content: center;
  align-items: center;
`;

const UpperContainer = styled.View`
  flex: 1;
  width: 100%;
  /* background-color: #09890a; */
`;

const UppderTouchableContainer = styled.View`
  flex-direction: row;
  padding: 0 ${pixelScaler(30)}px;
  width: 100%;
  margin-top: ${pixelScaler(48)}px;
  justify-content: space-between;
`;

const TitleContainer = styled.View`
  position: absolute;
  bottom: ${pixelScaler(40)}px;
  width: 100%;
  align-items: center;
`;

const ProgressContainer = styled.View`
  /* padding: 0 ${pixelScaler(30)}px; */
  width: 100%;
  align-items: flex-start;
`;

const FooterContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0 ${pixelScaler(40)}px;
`;

const MomentView = ({ data }: { data: any }) => {
  const navigation = useNavigation<any>();

  const video = useRef<any>(null);
  const position = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [indicatorPosition, setIndicatorPosition] = useState<any>(null);

  const { width, height } = useWindowDimensions();
  const [length, setLength] = useState(0);
  // const position = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    // console.log("refetch!", messageData?.getRoomMessages?.messages.length);
    if (video.current) {
      video.current.playAsync();
    }
  }, []);

  const text =
    "정신없이 하루를 보내다 보면 문득 아이가 되어버리고 싶어지는 순간이 있다. 아직 내 안에 어린 내가 있는 것일까 주변이 나를 과거로 돌아가게 만든 것일까.";

  let lines = [];
  const words = text.split(" ");
  let l = 0;
  let ind = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (lines.length === 2) {
      lines.push(text.substring(ind, text.length));
    }
    if (l + word.length > 24) {
      if (l > 20) {
        lines.push(text.substr(ind, l - 1));
        ind = ind + l;
        l = 0;
      } else {
        lines.push(text.substr(ind, 24));
        ind = ind + 24;
        l = 0;
      }
    } else {
      l += word.length + 1;
    }
  }

  return (
    <Container>
      <UpperContainer>
        <UppderTouchableContainer>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
          >
            <Ionicons
              style={{ left: -8 }}
              name="chevron-back"
              color="#ffffff"
              size={26}
            />
          </TouchableOpacity>
          <ThreeDots color={"#ffffff"} onPress={() => {}} />
        </UppderTouchableContainer>
        <TitleContainer>
          <RegText20 style={{ color: "#ffffff" }}>유니언타운</RegText20>
        </TitleContainer>
      </UpperContainer>
      <ProgressContainer>
        <Animated.View
          style={{
            backgroundColor: "#ffffff",
            height: pixelScaler(1.6),
            borderRadius: pixelScaler(0.8),
            width: indicatorPosition,
          }}
        />
      </ProgressContainer>
      <TouchableWithoutFeedback
        onPressIn={async () => {
          await video.current.pauseAsync();
        }}
        onPressOut={async () => {
          await video.current.playAsync();
        }}
      >
        <Video
          ref={video}
          style={{
            width,
            height: (width * 4) / 3,
          }}
          source={{
            uri: "https://splace-test.s3.ap-northeast-2.amazonaws.com/test2.mp4",
          }}
          resizeMode="cover"
          onPlaybackStatusUpdate={(e: AVPlaybackStatus) => {
            // setStatus(() => e);
            if (e.isLoaded) {
              if (e.durationMillis && length === 0) {
                setIndicatorPosition(
                  position.interpolate({
                    inputRange: [0, e.durationMillis],
                    outputRange: [0, pixelScaler(375)],
                  })
                );
                // console.log(e);
                setLength(e.durationMillis);
                // console.log(e.durationMillis);
              }
              if (e.positionMillis) {
                // console.log(e);
                position.setValue(e.positionMillis);
                // console.log(indicatorPosition);
              }
            }
          }}
          progressUpdateIntervalMillis={30}
        />
      </TouchableWithoutFeedback>
      <FooterContainer>
        <RegText13
          numberOfLines={3}
          style={{ color: "#ffffff", lineHeight: pixelScaler(23) }}
        >
          {text}
        </RegText13>
        {/* <RegText13 style={{ color: "#ffffff", lineHeight: pixelScaler(23) }}>
          {lines[0]}
        </RegText13>
        <RegText13 style={{ color: "#ffffff", lineHeight: pixelScaler(23) }}>
          {lines[1]}
        </RegText13>
        <RegText13 style={{ color: "#ffffff", lineHeight: pixelScaler(23) }}>
          {lines[2]}
        </RegText13> */}
        <RegText13 style={{ color: "rgba(174,174,178,0.6)" }}>
          iam_maknae
        </RegText13>
      </FooterContainer>
    </Container>
  );
};

export default MomentView;
