import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { PhotologType, StackGeneratorParamList } from "../types";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";
import { FlatList } from "react-native";
import { GET_LOGS_BY_CATEGORY } from "../queries";
import { TouchableOpacity } from "react-native-gesture-handler";
import Image from "../components/Image";
import { RegText16 } from "../components/Text";

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 ${pixelScaler(30)}px;
`;

const LogContainer = styled.TouchableOpacity`
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const Tag = styled.View`
  height: ${pixelScaler(25)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(25)}px;
  border-width: ${pixelScaler(1)}px;
  align-items: center;
  justify-content: center;
`;

const LogsByCategory = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { category } =
    useRoute<RouteProp<StackGeneratorParamList, "LogsByCategory">>().params;

  const { data, loading, fetchMore } = useQuery(GET_LOGS_BY_CATEGORY, {
    variables: { tagId: category.id },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Tag>
          <RegText16>{category.name}</RegText16>
        </Tag>
      ),
    });
  }, []);

  return (
    <ScreenContainer>
      <FlatList
        data={data?.getLogsByCategory?.logs}
        numColumns={2}
        onEndReached={() =>
          fetchMore({
            variables: {
              tagId: category.id,
              lastId:
                data?.getLogsByCategory?.logs[
                  data?.getLogsByCategory?.logs.length - 1
                ].id,
            },
          })
        }
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
      />
    </ScreenContainer>
  );
};

export default LogsByCategory;
