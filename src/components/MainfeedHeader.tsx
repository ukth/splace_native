import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ScreenStackHeaderRightView } from "react-native-screens";
import styled from "styled-components/native";
import { Icons } from "../icons";
import { StackGeneratorParamList, ThemeType } from "../types";
import { pixelScaler } from "../utils";
import { BldText16 } from "./Text";

const Container = styled.SafeAreaView`
  width: 100%;
  height: ${pixelScaler(95)}px;
  /* background-color: #90e0f0; */
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
  box-shadow: 0 0 0.3px rgba(0, 0, 0, 0.25);
`;

const HeaderLeftContainer = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${pixelScaler(90)}px;
  height: ${pixelScaler(50)}px;
`;

const HeaderRightContainer = styled.View`
  position: absolute;
  right: 0;
  bottom: 0;
  width: ${pixelScaler(55)}px;
  height: ${pixelScaler(50)}px;
  z-index: 1;
  /* background-color: #8040f0; */
`;

const AddButtonContainer = styled.View`
  width: ${pixelScaler(25)}px;
  height: ${pixelScaler(25)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(5)}px;
  border-width: ${pixelScaler(1.67)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const Bar = styled.View`
  position: absolute;
  width: ${pixelScaler(10)}px;
  height: ${pixelScaler(1.68)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.text};
`;

const Tag = styled.TouchableOpacity`
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  border-width: ${pixelScaler(1.34)}px;
  align-items: center;
  justify-content: center;
  padding: 0 ${pixelScaler(10)}px;
`;

const MainfeedHeader = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const [showButtons, setShowButtons] = useState(false);
  const openAnim = useRef(new Animated.Value(0)).current;
  const translateX = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [211, 0],
  });

  const opacity_1 = openAnim.interpolate({
    inputRange: [0, 0.3, 0.4],
    outputRange: [0, 0, 1],
  });
  const opacity_2 = openAnim.interpolate({
    inputRange: [0, 0.5, 0.7],
    outputRange: [0, 0, 1],
  });
  const opacity_3 = openAnim.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [0, 0, 1],
  });

  const rotate = openAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  const foldButtons = Animated.timing(openAnim, {
    toValue: 0,
    duration: 150,
    useNativeDriver: true,
  });

  const unfoldButtons = Animated.timing(openAnim, {
    toValue: 1,
    duration: 150,
    useNativeDriver: true,
  });

  const openButtons = () => {
    // setShowModal(true);
    unfoldButtons.start(() => setShowButtons(true));
  };

  const closeButtons = () => {
    foldButtons.start(() => setShowButtons(false));
  };

  return (
    <Container>
      <HeaderLeftContainer>
        <Image
          source={Icons.super_box}
          style={{ width: pixelScaler(59), height: pixelScaler(35) }}
        />
      </HeaderLeftContainer>
      <HeaderRightContainer>
        <TouchableOpacity
          hitSlop={{
            top: pixelScaler(10),
            bottom: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
          }}
          onPress={() => {
            if (showButtons) {
              closeButtons();
            } else {
              openButtons();
            }
          }}
          style={{
            // position: "absolute",
            // backgroundColor: "#90e0f0",
            top: pixelScaler(12),
          }}
        >
          <AddButtonContainer>
            <Animated.View
              style={{
                alignItems: "center",
                justifyContent: "center",
                transform: [{ rotate: rotate }],
                // backgroundColor: "#90e0f0",
                width: pixelScaler(10),
                height: pixelScaler(10),
              }}
            >
              <Bar />
              <Bar style={{ transform: [{ rotate: "90 deg" }] }} />
            </Animated.View>
          </AddButtonContainer>
        </TouchableOpacity>
      </HeaderRightContainer>
      <Animated.View
        style={{
          transform: [
            {
              translateX: translateX,
            },
          ],
          flexDirection: "row",
          // width: pixelScaler(150),
          // height: pixelScaler(80),
          // backgroundColor: "#e0a0f0",
          position: "absolute",
          bottom: pixelScaler(13),
          right: pixelScaler(68),
        }}
      >
        <Animated.View
          style={{
            opacity: opacity_1,
            marginRight: pixelScaler(10),
          }}
        >
          <Tag
            onPress={() => {
              // navigation.push("Upload");
            }}
          >
            <BldText16>시리즈</BldText16>
          </Tag>
        </Animated.View>
        <Animated.View
          style={{
            opacity: opacity_2,
            marginRight: pixelScaler(10),
          }}
        >
          <Tag
            onPress={() => {
              navigation.push("UploadMoment");
            }}
          >
            <BldText16>모먼트</BldText16>
          </Tag>
        </Animated.View>
        <Animated.View
          style={{
            opacity: opacity_3,
          }}
        >
          <Tag
            onPress={() => {
              // navigation.push("Upload");
            }}
          >
            <BldText16>로그</BldText16>
          </Tag>
        </Animated.View>
      </Animated.View>
    </Container>
  );
};

export default MainfeedHeader;
