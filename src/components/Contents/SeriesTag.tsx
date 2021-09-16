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
  padding: 0 ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
`;

const SeriesTag = ({ series }: { series: { id: number; title: string } }) => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const theme = useContext(ThemeContext);

  return (
    <Container>
      <Tag
        onPress={() =>
          navigation.push("Series", {
            seriesId: series.id,
            title: series.title,
          })
        }
      >
        <RegText13 style={{ color: theme.greyText }}>{series.title}</RegText13>
      </Tag>
    </Container>
  );
};

export default SeriesTag;
