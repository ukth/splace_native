import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList } from "react-native";
import PhotoLog from "../../components/Contents/Photolog";
import ScreenContainer from "../../components/ScreenContainer";
import { BldText16 } from "../../components/Text";
import { PhotologType, StackGeneratorParamList, UserType } from "../../types";

const UserLogs = () => {
  const route = useRoute<RouteProp<StackGeneratorParamList, "UserLogs">>();
  const { initialScrollIndex, data, fetchMore, refetch } = route.params;
  const [logs, setLogs] = useState(
    data.getUserLogs?.logs.slice(initialScrollIndex) ?? []
  );
  const [topIndex, setTopIndex] = useState(initialScrollIndex);
  var isFetchingPrev = useRef({ value: false }).current;
  // const { data, refetch, fetchMore } = useQuery(GET_USER_LOGS, {
  //   variables: {
  //     userId: user.id,
  //   },
  // });
  // console.log(data);
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const onTopReached = () => {
    setLogs((logs) => {
      let prevLogs: number[];
      if (topIndex === 0) {
        return;
      }
      if (topIndex > 9) {
        prevLogs = data.getUserLogs?.logs.slice(topIndex - 9, topIndex);
        setTopIndex(topIndex - 9);
      } else {
        prevLogs = data.getUserLogs?.logs.slice(0, topIndex);
        setTopIndex(0);
      }
      return [...prevLogs, ...logs];
    });

    // setLogs(data.getUserLogs?.logs);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>게시물</BldText16>,
    });
    setTimeout(onTopReached, 0);
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

  const keyExtractor = (item: any) => "" + item.id;

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
  }) => <PhotoLog item={item} />;

  return (
    <ScreenContainer>
      <FlatList
        ref={flatList}
        data={logs}
        refreshing={refreshing}
        keyExtractor={keyExtractor}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.contentOffset.y < 500 &&
            topIndex > 0 &&
            !isFetchingPrev.value
          ) {
            isFetchingPrev.value = true;
            onTopReached();
          }
          if (nativeEvent.contentOffset.y > 500 && isFetchingPrev.value) {
            isFetchingPrev.value = false;
          }
        }}
        onEndReached={onEndReached}
        onRefresh={refresh}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
};

export default UserLogs;
