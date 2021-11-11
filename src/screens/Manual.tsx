import { setStatusBarStyle } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { checkMenual, pixelScaler } from "../utils";
import { Icon } from "../components/Icon";
import ScreenContainer from "../components/ScreenContainer";
import { ThemeType } from "../types";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(30)}px;
  top: ${pixelScaler(50)}px;
`;

const UpperContainer = styled.View`
  height: ${pixelScaler(100)}px;
`;

const DotsContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(10)}px;
`;

const Dots = styled.View`
  width: ${pixelScaler(11)}px;
  height: ${pixelScaler(11)}px;
  border-radius: ${pixelScaler(11)}px;
  margin-right: ${pixelScaler(13)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.greyButton};
`;

const Manual = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { width, height } = useWindowDimensions();

  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <DotsContainer>
          <Dots
            style={
              scrollIndex === 0 ? { backgroundColor: theme.greyTextAlone } : {}
            }
          />
          <Dots
            style={
              scrollIndex === 1 ? { backgroundColor: theme.greyTextAlone } : {}
            }
          />
          <Dots
            style={
              scrollIndex === 2 ? { backgroundColor: theme.greyTextAlone } : {}
            }
          />
          <Dots
            style={
              scrollIndex === 3
                ? { backgroundColor: theme.greyTextAlone, marginRight: 0 }
                : { marginRight: 0 }
            }
          />
        </DotsContainer>
      ),
    });
  }, [scrollIndex]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      headerRight: () => (
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
          }}
          onPress={() => {
            checkMenual();
            navigation.pop();
          }}
        >
          <Icon
            name="close"
            style={{ width: pixelScaler(11), height: pixelScaler(11) }}
          />
        </TouchableOpacity>
      ),
      title: "",
      headerStyle: {
        shadowColor: "transparent",
      },
    });
  }, []);

  return (
    <ScreenContainer style={{ position: "absolute" }}>
      <UpperContainer></UpperContainer>
      <ScrollView
        pagingEnabled={true}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{
          width,
          height: height - 100,
        }}
        onScroll={({ nativeEvent }) => {
          const ind = Math.floor(
            (nativeEvent.contentOffset.x + width / 2) / width
          );
          if (ind != scrollIndex) {
            setScrollIndex(ind);
          }
        }}
        scrollEventThrottle={16}
      >
        <Image
          style={{
            width: width,
            height: height - 100,
          }}
          source={require("../../assets/images/menual/test.gif")}
        />
        <Image
          style={{
            width,
            height: height - 100,
          }}
          source={require("../../assets/images/menual/test2.gif")}
        />
        <Image
          style={{
            width,
            height: height - 100,
          }}
          source={require("../../assets/images/menual/test.gif")}
        />
        <Image
          style={{
            width,
            height: height - 100,
          }}
          source={require("../../assets/images/menual/test2.gif")}
        />
      </ScrollView>
    </ScreenContainer>
  );
};

export default Manual;
