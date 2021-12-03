import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import useBigCategories from "../../hooks/useBigCategories";
import { GET_RECOMMENDED_CATEGORIES, GET_RECOMMENDED_LOG } from "../../queries";
import {
  BigCategoryType,
  PhotologType,
  RatingtagType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { pixelScaler } from "../../utils";
import Image from "../Image";
import ScreenContainer from "../ScreenContainer";
import Tag from "./Tag";

const TagBox = styled.View`
  width: 100%;
  padding-left: ${pixelScaler(30)}px;
  margin-top: ${pixelScaler(20)}px;
  margin-bottom: ${pixelScaler(15)}px;
  flex-direction: row;
  overflow: hidden;
  flex-wrap: wrap;
`;

const LogContainer = styled.View`
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
            {recommendedCategories?.suggestTags?.ratingtags?.map(
              (ratingtag: RatingtagType) => (
                <Tag
                  key={ratingtag.id + ""}
                  text={ratingtag.name}
                  onPress={() =>
                    navigation.push("SplacesByRatingtag", { ratingtag })
                  }
                  color={theme.textHighlight}
                />
              )
            )}
            {recommendedCategories?.suggestTags?.bigCategories?.map(
              (category: BigCategoryType) => (
                <Tag
                  key={category.id + ""}
                  text={category.name}
                  onPress={() =>
                    navigation.push("LogsByBigCategory", {
                      bigCategory: category,
                    })
                  }
                />
              )
            )}
          </TagBox>
        )}
        renderItem={({ item }: { item: PhotologType }) => (
          <TouchableWithoutFeedback
            onPress={() => navigation.push("Log", { id: item.id })}
          >
            <LogContainer>
              <Image
                source={{ uri: item.imageUrls[0] }}
                style={{
                  width: pixelScaler(186),
                  height: pixelScaler(186),
                }}
              />
            </LogContainer>
          </TouchableWithoutFeedback>
        )}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default Preview;
