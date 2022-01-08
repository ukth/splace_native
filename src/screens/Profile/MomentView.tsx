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
  ScrollView,
} from "react-native";
import { pixelScaler } from "../../utils";
import styled from "styled-components/native";
import { RegText13, RegText20 } from "../../components/Text";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { AVPlaybackStatus, Video } from "expo-av";
import { MomentType, StackGeneratorParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { Icon } from "../../components/Icon";

const Container = styled.View`
  flex: 1;
  background-color: #000000;
  justify-content: center;
  align-items: center;
`;

const UpperContainer = styled.View`
  /* flex: 1; */
  width: 100%;
  justify-content: center;
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
  padding: 0 ${pixelScaler(30)}px;
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

  let isLoaded = false;

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
    if (length === 0 && !isLoaded) {
      video.current.playAsync();
    }
  }, [isLoaded, length]);

  useEffect(() => {
    isLoaded = false;
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

  return (
    <Container>
      <UpperContainer
        style={{
          height: (height - (width * 4) / 3) / 2,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
          hitSlop={{
            top: pixelScaler(10),
            bottom: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
          }}
          style={{
            position: "absolute",
            left: pixelScaler(27),
            top: pixelScaler(60),
          }}
        >
          <Icon
            name="close_white"
            style={{
              width: pixelScaler(11),
              height: pixelScaler(11),
            }}
          />
        </TouchableOpacity>
        <UpperTouchableContainer>
          {/* <ThreeDots color={"#2a2a2a"} onPress={() => {}} /> */}
        </UpperTouchableContainer>
        <TitleContainer>
          <RegText20
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ color: "#ffffff" }}
          >
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
        }}
        onPressOut={async (e) => {
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
            if (e.isLoaded && e.didJustFinish) {
              isLoaded = false;
              next();
            }
            if (!isLoaded && e.isLoaded && e.shouldPlay && e.durationMillis) {
              if (!isLoaded && length === 0) {
                video.current.setPositionAsync(0);
                isLoaded = true;
                video.current.playAsync();
                setLength(e.durationMillis);
                setIndicatorPosition(
                  position.interpolate({
                    inputRange: [0, e.durationMillis],
                    outputRange: [0, pixelScaler(375)],
                  })
                );
              }
              // if (e.durationMillis && length === 0) {
              //   console.log(e);
              //   setIndicatorPosition(
              //     position.interpolate({
              //       inputRange: [0, e.durationMillis],
              //       outputRange: [0, pixelScaler(375)],
              //     })
              //   );
              //   setLength(e.durationMillis);
              // }
              if (e.positionMillis) {
                position.setValue(e.positionMillis);
              }
            }
          }}
          progressUpdateIntervalMillis={30}
        />
      </Pressable>

      <FooterContainer>
        <View
          style={{
            maxHeight: pixelScaler(80),
            marginBottom: pixelScaler(20),
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: pixelScaler(80),
              }}
            >
              <RegText13
                style={{ color: "#ffffff", lineHeight: pixelScaler(23) }}
              >
                {moments[momentIndex].text}
              </RegText13>
              <RegText13 style={{ color: "rgba(174,174,178,0.6)" }}>
                {moments[momentIndex].author.username}
              </RegText13>
            </View>
          </ScrollView>
        </View>
      </FooterContainer>
    </Container>
  );
};

export default MomentView;
