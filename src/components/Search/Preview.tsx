import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect } from "react";
import { FlatList, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import useBigCategories from "../../hooks/useBigCategories";
import { GET_RECOMMENDED_CATEGORIES, GET_RECOMMENDED_LOG } from "../../queries";
import {
  BigCategoryType,
  PhotologType,
  RatingTagType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { pixelScaler } from "../../utils";
import { CardBox, RowCardBoxContainer } from "../CardRowBox";
import Image from "../Image";
import ScreenContainer from "../ScreenContainer";
import Tag from "./Tag";

const TagBox = styled.View`
  width: 100%;
  padding-left: ${pixelScaler(30)}px;
  /* margin-top: ${pixelScaler(30)}px; */
  flex-direction: row;
  overflow: hidden;
  flex-wrap: wrap;
`;

const Recommendation = styled.View`
  margin-top: 15px;
`;

const LogContainer = styled.TouchableOpacity`
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const Preview = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const suggestedCategories: BigCategoryType[] = useBigCategories();
  const { data: recommendedCategories } = useQuery(GET_RECOMMENDED_CATEGORIES);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { data: recommendedLogs } = useQuery(GET_RECOMMENDED_LOG);

  // useEffect(() => {
  //   console.log(recommendedLogs);
  // }, [recommendedLogs]);

  return (
    <ScreenContainer>
      <FlatList
        data={recommendedLogs?.getSuggestLogs?.logs}
        numColumns={2}
        ListHeaderComponent={() => (
          <TagBox>
            {/* {recommendedCategories?.suggestTags?.ratingtags?.map(
              (ratingTag: RatingTagType) => (
                <Tag
                  key={ratingTag.id + ""}
                  text={ratingTag.name}
                  onPress={() => {}}
                  color={theme.ratingTag}
                />
              )
            )}

            {recommendedCategories?.suggestTags?.bigCategories?.map(
              (category: BigCategoryType) => (
                <Tag
                  key={category.id + ""}
                  text={category.name}
                  onPress={() => {}}
                />
              )
            )} */}
          </TagBox>
        )}
        renderItem={({ item }: { item: PhotologType }) => (
          <LogContainer onPress={() => navigation.push("Log", { id: item.id })}>
            <Image
              source={{ uri: item.imageUrls[0] }}
              style={{
                width: pixelScaler(186),
                height: pixelScaler(186),
              }}
            />
          </LogContainer>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default Preview;
