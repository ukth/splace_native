import { useQuery } from "@apollo/client";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, FlatList } from "react-native";
import PhotoLog from "../../components/Contents/Photolog";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import ScreenContainer from "../../components/ScreenContainer";
import { GET_USER_LOGS } from "../../queries";
import { PhotologType, StackGeneratorParamList, UserType } from "../../types";

const UserLogs = () => {
  const route = useRoute<RouteProp<StackGeneratorParamList, "UserLogs">>();
  const { user, initialScrollIndex, data, fetchMore, refetch } = route.params;
  // const { data, refetch, fetchMore } = useQuery(GET_USER_LOGS, {
  //   variables: {
  //     userId: user.id,
  //   },
  // });
  // console.log(data);
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  useEffect(() => {
    navigation.setOptions({
      title: "게시물",
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    await refetch();
    clearTimeout(timer);
    setRefreshing(false);
  };

  const flatList = useRef<any>();

  const keyExtractor = (item: any, index: number) => "" + item.id;
  const onScrollToIndexFailed = ({ index }: { index: number }) => {
    // Layout doesn't know the exact location of the requested element.
    // Falling back to calculating the destination manually

    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      flatList.current?.scrollToIndex({ index: index, animated: true });
    });
  };
  const onEndReached = async () => {
    await fetchMore({
      variables: {
        lastLogId: data.getUserLogs?.logs[data.getUserLogs?.logs.length - 1].id,
      },
    });
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: PhotologType;
    index: number;
  }) => <PhotoLog item={item} key={index} />;

  return (
    <ScreenContainer>
      <FlatList
        ref={flatList}
        data={data.getUserLogs?.logs}
        refreshing={refreshing}
        keyExtractor={keyExtractor}
        initialScrollIndex={initialScrollIndex}
        onScrollToIndexFailed={onScrollToIndexFailed}
        onEndReached={onEndReached}
        onRefresh={refresh}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default UserLogs;
