import React, { useContext } from "react";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import styled, { ThemeContext } from "styled-components/native";
import { themeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText13 } from "../Text";

const Container = styled.View`
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(30)}px;
  flex-direction: row;
  margin-bottom: ${pixelScaler(10)}px;
`;

const Tag = styled.TouchableOpacity`
  height: ${pixelScaler(20)}px;
  border-width: ${pixelScaler(0.8)}px;
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: themeType }) => theme.tagGreyBorder};
  margin-right: ${pixelScaler(10)}px;
  padding: 0 ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
`;

const SeriesTag = ({
  series,
  pressMoreSeries,
}: {
  series: { id: number; title: string }[];
  pressMoreSeries: () => void;
}) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useContext(ThemeContext);

  return (
    <Container>
      <Tag
        onPress={() =>
          navigation.push("Series", {
            seriesId: series[0].id,
            title: series[0].title,
          })
        }
      >
        <RegText13 style={{ color: theme.greyText }}>
          {series[0].title}
        </RegText13>
      </Tag>
      {series.length > 1 ? (
        <Tag onPress={pressMoreSeries}>
          <RegText13 style={{ color: theme.greyText }}>
            +{series.length - 1}
          </RegText13>
        </Tag>
      ) : null}
    </Container>
  );
};

export default SeriesTag;
