import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { GET_SERIES } from "../queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { PhotologType } from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { useContext } from "react";
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { BldText13, RegText13 } from "../components/Text";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { FlatList } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { CardBox, RowCardBoxContainer } from "../components/CardRowBox";

const Series = ({
  route,
}: {
  route: { params: { seriesId: number; title: string } };
}) => {
  const seriesId = route.params.seriesId;
  const [series, setSeries] = useState<(PhotologType | null)[][]>([]);
  const navigation = useNavigation<any>();

  const theme = useContext(ThemeContext);

  const HeaderTag = styled.TouchableOpacity`
    height: ${pixelScaler(20)}px;
    border-width: ${pixelScaler(0.8)}px;
    border-radius: ${pixelScaler(10)}px;
    border-color: ${theme.tagGreyBorder};
    padding: 0 ${pixelScaler(10)}px;
    align-items: center;
    justify-content: center;
  `;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderTag>
          <RegText13 style={{ color: theme.greyText }}>
            {route.params.title}
          </RegText13>
        </HeaderTag>
      ),
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            console.log("pop!");
            navigation.pop();
          }}
        />
      ),
    });
  }, []);

  const onCompleted = async (data: { getSeries: PhotologType[] }) => {
    const { getSeries: seriesData } = data;

    const seriesLen = seriesData.length;

    if (seriesData) {
      let tmp = [];
      for (let i = 0; i < Math.floor(seriesLen / 2); i++) {
        tmp.push([seriesData[2 * i], seriesData[2 * i + 1]]);
      }
      if (seriesLen % 2 === 1) {
        tmp.push([seriesData[seriesLen - 1], null]);
      }
      setSeries(tmp);
    } else {
      setSeries([]);
    }
  };

  const onError = async (error: any) => {
    console.log("err", error);
  };

  const { loading, error, data } = useQuery(GET_SERIES, {
    onCompleted,
    variables: { seriesId },
  });

  const Container = styled.ScrollView`
    flex: 1;
    background-color: ${theme.background};
  `;

  return (
    <Container>
      {series.map((photologs, index) => (
        <RowCardBoxContainer key={index}>
          {photologs[0] ? (
            <CardBox
              text={photologs[0].splace.name}
              url={photologs[0].imageUrls[0]}
              onPress={() => {}}
            />
          ) : null}
          {photologs[1] ? (
            <CardBox
              text={photologs[1].splace.name}
              url={photologs[1].imageUrls[0]}
              onPress={() => {}}
            />
          ) : null}
        </RowCardBoxContainer>
      ))}
    </Container>
  );
};

export default Series;
