import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  Pressable,
} from "react-native";
import { pixelScaler } from "../../utils";
import styled from "styled-components/native";
import { RegText13, RegText20 } from "../../components/Text";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { AVPlaybackStatus, Video } from "expo-av";
import { ScreenBackButton } from "../../components/ScreenBackButton";
import { Ionicons } from "@expo/vector-icons";
import ThreeDots from "../../components/ThreeDots";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MomentType, StackGeneratorParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import * as VideoThumbnails from "expo-video-thumbnails";
import BottomSheetModal from "../../components/BottomSheetModal";
import { Icon } from "../../components/Icon";

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

const UpperTouchableContainer = styled.View`
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

const MomentView = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const route = useRoute<RouteProp<StackGeneratorParamList, "MomentView">>();

  const { moments, index } = route.params;

  const video = useRef<any>(null);
  const position = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [momentIndex, setMomentIndex] = useState(index);

  const [indicatorPosition, setIndicatorPosition] = useState<any>(null);

  const { width, height } = useWindowDimensions();
  const [length, setLength] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    if (video.current) {
      video.current.playAsync();
    }
  }, []);

  let timer = 0;

  let lines = [];
  const words = moments[momentIndex].text.split(" ");
  let l = 0;
  let ind = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (lines.length === 2) {
      lines.push(
        moments[momentIndex].text.substring(
          ind,
          moments[momentIndex].text.length
        )
      );
    }
    if (l + word.length > 24) {
      if (l > 20) {
        lines.push(moments[momentIndex].text.substr(ind, l - 1));
        ind = ind + l;
        l = 0;
      } else {
        lines.push(moments[momentIndex].text.substr(ind, 24));
        ind = ind + 24;
        l = 0;
      }
    } else {
      l += word.length + 1;
    }
  }

  useEffect(() => {
    if (length === 0 && isLoaded) {
      (async () => {
        // await video.current.setPositionAsync(0);
        await video.current.playAsync();
      })();
    }
  }, [isLoaded, length]);

  useEffect(() => {
    setIsLoaded(false);
    setLength(0);
  }, [momentIndex]);

  const back = async () => {
    if (momentIndex === 0) {
      navigation.pop();
    } else {
      setMomentIndex(momentIndex - 1);
    }
  };

  const next = async () => {
    if (momentIndex === moments.length - 1) {
      navigation.pop();
    } else {
      setMomentIndex(momentIndex + 1);
    }
  };

  console.log(moments);

  return (
    <Container>
      <UpperContainer>
        <UpperTouchableContainer>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}
          >
            <Icon
              name="close"
              style={{
                width: pixelScaler(12.7),
                height: pixelScaler(27),
              }}
            />
          </TouchableOpacity>
          <ThreeDots color={"#ffffff"} onPress={() => {}} />
        </UpperTouchableContainer>
        <TitleContainer>
          <RegText20 style={{ color: "#ffffff" }}>
            {moments[momentIndex].splace?.name ?? moments[momentIndex].title}
          </RegText20>
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
      <Pressable
        onPressIn={(e) => {
          (async () => await video.current.pauseAsync())();
          // if (Date.now() - timer > 700) {
          //   timer = Date.now();
          //   (async () => await video.current.pauseAsync())();
          // }
        }}
        onPressOut={async (e) => {
          // console.log(Date.now() - timer);
          // if (Date.now() - timer < 700) {
          //   if (e.nativeEvent?.locationX > pixelScaler(187)) {
          //     next();
          //   } else {
          //     back();
          //   }
          // }
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
            uri: moments[momentIndex].videoUrl,
          }}
          resizeMode="cover"
          onPlaybackStatusUpdate={(e: AVPlaybackStatus) => {
            // console.log(e);
            if (e.isLoaded && e.didJustFinish) {
              next();
            }
            if (e.isLoaded) {
              if (!isLoaded) {
                video.current.setPositionAsync(0);
                setIsLoaded(true);
              }
              if (e.durationMillis && length === 0) {
                setIndicatorPosition(
                  position.interpolate({
                    inputRange: [0, e.durationMillis],
                    outputRange: [0, pixelScaler(375)],
                  })
                );
                setLength(e.durationMillis);
              }
              if (e.positionMillis) {
                position.setValue(e.positionMillis);
              }
            }
          }}
          progressUpdateIntervalMillis={30}
        />
      </Pressable>
      <FooterContainer>
        <RegText13
          numberOfLines={3}
          style={{ color: "#ffffff", lineHeight: pixelScaler(23) }}
        >
          {moments[momentIndex].text}
        </RegText13>
        <RegText13 style={{ color: "rgba(174,174,178,0.6)" }}>
          {moments[momentIndex].author.username}
        </RegText13>
      </FooterContainer>
    </Container>
  );
};

export default MomentView;
