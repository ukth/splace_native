import { setStatusBarStyle } from "expo-status-bar";
import React, { useContext, useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { checkMenual, pixelScaler } from "../utils";
import { Icon } from "../components/Icon";
import ScreenContainer from "../components/ScreenContainer";
import { RootStackParamList, ThemeType } from "../types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { BldText16 } from "../components/Text";
import FeedManual from "../components/Manual/FeedManual";
import UploadManual from "../components/Manual/UploadManual";
import KeepManual from "../components/Manual/KeepManual";

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(30)}px;
  top: ${pixelScaler(50)}px;
`;

const DotsContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(10)}px;
`;

const Dots = styled.View`
  width: ${pixelScaler(10)}px;
  height: ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-right: ${pixelScaler(15)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.greyButton};
`;

const Manual = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { n } = useRoute<RouteProp<RootStackParamList, "Manual">>().params;

  const [scrollIndex, setScrollIndex] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        n === 1 ? null : (
          <DotsContainer>
            <Dots
              style={
                scrollIndex === 0
                  ? { backgroundColor: theme.greyTextAlone }
                  : {}
              }
            />
            <Dots
              style={
                scrollIndex === 1
                  ? { backgroundColor: theme.greyTextAlone }
                  : {}
              }
            />
            <Dots
              style={
                scrollIndex === 2
                  ? n === 2
                    ? { backgroundColor: theme.greyTextAlone, marginRight: 0 }
                    : { backgroundColor: theme.greyTextAlone }
                  : n === 2
                  ? { marginRight: 0 }
                  : {}
              }
            />
            {n === 0 ? (
              <Dots
                style={
                  scrollIndex === 3
                    ? { backgroundColor: theme.greyTextAlone, marginRight: 0 }
                    : { marginRight: 0 }
                }
              />
            ) : null}
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
            checkMenual(n);
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
      {n === 0 ? (
        <FeedManual scrollIndex={scrollIndex} setScrollIndex={setScrollIndex} />
      ) : n === 1 ? (
        <UploadManual
          scrollIndex={scrollIndex}
          setScrollIndex={setScrollIndex}
        />
      ) : (
        <KeepManual scrollIndex={scrollIndex} setScrollIndex={setScrollIndex} />
      )}
    </ScreenContainer>
  );
};

export default Manual;
