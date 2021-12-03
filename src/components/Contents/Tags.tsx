import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components/native";
import {
  BigCategoryType,
  CategoryType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { pixelScaler, shortenAddress } from "../../utils";
import { RegText13 } from "../Text";
import ModalMapSplaceView from "../ModalMapSplaceView";
import { Icon } from "../Icon";
import { Image } from "react-native";

const Container = styled.View`
  flex-direction: row;
  width: ${pixelScaler(350)}px;
  flex-wrap: wrap;
`;

const Tag = styled.TouchableOpacity`
  height: ${pixelScaler(20)}px;
  border-width: ${pixelScaler(0.67)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.tagBorder};
  padding: 0 ${pixelScaler(9)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(8)}px;
  margin-bottom: ${pixelScaler(8)}px;
  padding-top: ${pixelScaler(1.3)}px;
  flex-direction: row;
`;

const Tags = ({
  splace,
  bigCategories,
  categories,
}: {
  splace: SplaceType | undefined;
  bigCategories: BigCategoryType[];
  categories: CategoryType[];
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  // console.log(tags);

  const theme = useContext<ThemeType>(ThemeContext);

  const [showMap, setShowMap] = useState(false);

  return (
    <Container>
      {splace?.address ? (
        <Tag
          style={{
            borderRadius: 0,
          }}
          onPress={() => setShowMap(true)}
        >
          <Image
            source={require("../../../assets/images/icons/positionpin_small.png")}
            style={{
              width: pixelScaler(8.3),
              height: pixelScaler(12),
              marginRight: pixelScaler(6),
            }}
          />
          <RegText13>{shortenAddress(splace?.address)}</RegText13>
        </Tag>
      ) : null}
      {bigCategories.map((bigCategory: BigCategoryType, index: number) => (
        <Tag
          style={{ borderRadius: pixelScaler(10) }}
          key={index}
          onPress={() => navigation.push("LogsByBigCategory", { bigCategory })}
        >
          <RegText13>{bigCategory.name}</RegText13>
        </Tag>
      ))}
      {categories.map((category: CategoryType, index: number) => (
        <Tag
          style={{ borderRadius: pixelScaler(10) }}
          key={index}
          onPress={() => navigation.push("LogsByCategory", { category })}
        >
          <RegText13>{category.name}</RegText13>
        </Tag>
      ))}
      {splace ? (
        <ModalMapSplaceView
          setShowMap={setShowMap}
          showMap={showMap}
          splace={splace}
        />
      ) : null}
    </Container>
  );
};

export default Tags;
