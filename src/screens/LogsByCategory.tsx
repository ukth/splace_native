import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { PhotologType, StackGeneratorParamList } from "../types";
import styled from "styled-components/native";
import { pixelScaler } from "../utils";
import { Alert, FlatList, TouchableWithoutFeedback } from "react-native";
import { GET_LOGS_BY_CATEGORY, LOG_GETLOGSBYCATEGORIES } from "../queries";
import { TouchableOpacity } from "react-native-gesture-handler";
import Image from "../components/Image";
import { RegText16 } from "../components/Text";

const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 ${pixelScaler(30)}px;
`;

const LogContainer = styled.View`
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

const LogsByCategory = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { category } =
    useRoute<RouteProp<StackGeneratorParamList, "LogsByCategory">>().params;

  const { data, loading, fetchMore, refetch } = useQuery(GET_LOGS_BY_CATEGORY, {
    variables: { tagId: category.id },
  });

  const [refreshing, setRefreshing] = useState(false);

  const [log_getLogs, _1] = useMutation(LOG_GETLOGSBYCATEGORIES);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Tag>
          <RegText16>{category.name}</RegText16>
        </Tag>
      ),
    });
    try {
      log_getLogs({ variables: { tagId: category.id } });
    } catch {}
  }, []);

  navigation.addListener("focus", () => refetch());

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

  return (
    <ScreenContainer>
      <FlatList
        data={data?.getLogsByCategory?.logs}
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
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
      />
    </ScreenContainer>
  );
};

export default LogsByCategory;
