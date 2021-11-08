import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef, useContext } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import PhotoLog from "../../components/Contents/Photolog";
import Series from "../../components/Contents/Series";
import Image from "../../components/Image";
import ScreenContainer from "../../components/ScreenContainer";
import { BldText13, BldText16, RegText16 } from "../../components/Text";
import { BLANK_IMAGE } from "../../constants";
import { GET_SCRAPPED_LOGS, GET_SCRAPPED_SERIES } from "../../queries";
import {
  PhotologType,
  SeriesType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { pixelScaler } from "../../utils";

const LabelContainer = styled.View`
  flex-direction: row;
  height: ${pixelScaler(60)}px;
  align-items: center;
`;

const ItemContainer = styled.TouchableOpacity`
  width: ${pixelScaler(186)}px;
  height: ${pixelScaler(186)}px;
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const ScrappedContents = () => {
  const { data: logData, refetch: refetchLog } = useQuery(GET_SCRAPPED_LOGS);
  const { data: seriesData, refetch: refetchSeries } =
    useQuery(GET_SCRAPPED_SERIES);

  const [content, setContent] = useState<"log" | "series">("log");

  const theme = useContext<ThemeType>(ThemeContext);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  navigation.addListener("focus", () => {
    refetchLog();
    refetchSeries();
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>스크랩한 게시물</BldText16>,
    });
  }, []);

  return (
    <ScreenContainer>
      <LabelContainer>
        <TouchableOpacity
          onPress={() => setContent("log")}
          hitSlop={{
            top: pixelScaler(10),
            bottom: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
          }}
          style={{ marginLeft: pixelScaler(30) }}
        >
          {content === "log" ? (
            <BldText16>로그</BldText16>
          ) : (
            <RegText16 style={{ color: theme.greyText }}>로그</RegText16>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setContent("series")}
          hitSlop={{
            top: pixelScaler(10),
            bottom: pixelScaler(10),
            left: pixelScaler(10),
            right: pixelScaler(10),
          }}
          style={{ marginLeft: pixelScaler(20) }}
        >
          {content === "series" ? (
            <BldText16>시리즈</BldText16>
          ) : (
            <RegText16 style={{ color: theme.greyText }}>시리즈</RegText16>
          )}
        </TouchableOpacity>
      </LabelContainer>
      {content === "log" ? (
        <FlatList
          data={logData?.getMyScrapedLog?.logs}
          keyExtractor={(item) => item.id + ""}
          numColumns={2}
          renderItem={({
            item,
            index,
          }: {
            item: PhotologType;
            index: number;
          }) => (
            <ItemContainer
              onPress={() => navigation.push("Log", { id: item.id })}
            >
              <Image
                source={{ uri: item.imageUrls[0] ?? BLANK_IMAGE }}
                style={{
                  width: pixelScaler(186),
                  height: pixelScaler(186),
                }}
              />
            </ItemContainer>
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={seriesData?.getMyScrapedSeries?.series}
          keyExtractor={(item) => item.id + ""}
          numColumns={2}
          renderItem={({
            item,
            index,
          }: {
            item: SeriesType;
            index: number;
          }) => (
            <ItemContainer
              onPress={() => navigation.push("Series", { id: item.id })}
            >
              <LinearGradient
                // Background Linear Gradient
                colors={["rgba(0,0,0,0.2)", "transparent"]}
                style={{
                  top: 0,
                  position: "absolute",
                  height: pixelScaler(40),
                  width: pixelScaler(186),
                  zIndex: 1,
                }}
              />
              <BldText13
                style={{
                  position: "absolute",
                  zIndex: 2,
                  left: pixelScaler(15),
                  top: pixelScaler(15),
                  color: theme.white,
                  width: pixelScaler(145),
                }}
              >
                {item.title} ({item.seriesElements.length})
              </BldText13>
              <Image
                source={{
                  uri:
                    item.seriesElements[0].photolog.imageUrls[0] ?? BLANK_IMAGE,
                }}
                style={{
                  width: pixelScaler(186),
                  height: pixelScaler(186),
                }}
              />
            </ItemContainer>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
};

export default ScrappedContents;
