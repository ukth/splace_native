import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { PhotologType, StackGeneratorParamList } from "../types";
import styled from "styled-components/native";
import { GET_LOGS_BY_BIGCATEGORY } from "../queries";
import { FlatList } from "react-native";
import { pixelScaler } from "../utils";
import Image from "../components/Image";
import { RegText16 } from "../components/Text";

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

const LogsByBigCategory = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { bigCategory } =
    useRoute<RouteProp<StackGeneratorParamList, "LogsByBigCategory">>().params;

  const { data, loading, fetchMore } = useQuery(GET_LOGS_BY_BIGCATEGORY, {
    variables: { tagId: bigCategory.id },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Tag>
          <RegText16>{bigCategory.name}</RegText16>
        </Tag>
      ),
    });
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ScreenContainer>
      <FlatList
        data={data?.getLogsByBigCategory?.logs}
        onEndReached={() =>
          fetchMore({
            variables: {
              tagId: bigCategory.id,
              lastId:
                data?.getLogsByBigCategory?.logs[
                  data?.getLogsByBigCategory?.logs.length - 1
                ].id,
            },
          })
        }
        numColumns={2}
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

export default LogsByBigCategory;
