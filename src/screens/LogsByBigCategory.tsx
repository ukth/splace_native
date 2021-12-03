import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { PhotologType, StackGeneratorParamList } from "../types";
import styled from "styled-components/native";
import {
  GET_LOGS_BY_BIGCATEGORY,
  LOG_GETLOGSBYBIGCATEGORIES,
} from "../queries";
import { Alert, FlatList } from "react-native";
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
  border-width: ${pixelScaler(0.67)}px;
  align-items: center;
  justify-content: center;
  padding-top: ${pixelScaler(1.3)}px;
`;

const LogsByBigCategory = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { bigCategory } =
    useRoute<RouteProp<StackGeneratorParamList, "LogsByBigCategory">>().params;

  const [refreshing, setRefreshing] = useState(false);

  const { data, loading, fetchMore, refetch } = useQuery(
    GET_LOGS_BY_BIGCATEGORY,
    {
      variables: { tagId: bigCategory.id },
    }
  );

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("", "요청시간이 초과되었습니다.");
      setRefreshing(false);
    }, 10000);
    await refetch();
    clearTimeout(timer);
    setRefreshing(false);
  };

  const [log_getLogs, _1] = useMutation(LOG_GETLOGSBYBIGCATEGORIES);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Tag>
          <RegText16>{bigCategory.name}</RegText16>
        </Tag>
      ),
    });
    try {
      log_getLogs({ variables: { tagId: bigCategory.id } });
    } catch {}
  }, []);

  navigation.addListener("focus", () => refetch());

  return (
    <ScreenContainer>
      <FlatList
        data={data?.getLogsByBigCategory?.logs}
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
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
