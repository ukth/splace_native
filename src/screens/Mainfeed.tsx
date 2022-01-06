import React, { useEffect, useContext, useMemo } from "react";
import { FlatList } from "react-native";

import { GET_FEED } from "../queries";

import styled from "styled-components/native";
import { ThemeContext } from "styled-components";
import { useState } from "react";
import {
  PhotologType,
  SeriesType,
  StackGeneratorParamList,
  ThemeType,
} from "../types";

import { useQuery, useReactiveVar } from "@apollo/client";
import PhotoLog from "../components/Contents/Photolog";
import Series from "../components/Contents/Series";
import useMe from "../hooks/useMe";
import * as Linking from "expo-linking";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import * as Notifications from "expo-notifications";

const Container = styled.View`
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
  flex: 1;
`;
// ({ navigation,}: { navigation: StackNavigationProp<StackGeneratorParamList>;}) => {
const Mainfeed = () => {
  const theme = useContext(ThemeContext);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const _handleNotificationResponse = ({
    notification,
  }: {
    notification: Notifications.Notification;
  }) => {
    const data = notification.request.content.data;
    console.log("RESPONSE:", data.route);
    if (data.route === "Chatrooms") {
      navigation.navigate("Chatrooms");
    } else if (data.route === "Notification") {
      navigation.navigate("Notification");
    } else if (data.route === "Log" && data.params?.id) {
      navigation.navigate("Log", { id: data.params.id });
    }
  };

  useEffect(() => {
    Notifications.addNotificationResponseReceivedListener(
      _handleNotificationResponse
    );
  }, []);

  const me = useMe();

  const [feed, setFeed] = useState<
    (
      | { type: "log"; data: PhotologType }
      | { type: "series"; data: SeriesType }
    )[]
  >([]);

  const setFeedData = ({
    logs,
    series,
  }: {
    logs: PhotologType[];
    series: SeriesType[];
  }) => {
    const tmp: (
      | { type: "log"; data: PhotologType }
      | { type: "series"; data: SeriesType }
    )[] = [];
    let i = 0;
    let j = 0;
    while (i < logs.length || j < series.length) {
      if (j === series.length) {
        tmp.push({ type: "log", data: logs[i] });
        i++;
      } else if (i === logs.length) {
        tmp.push({ type: "series", data: series[j] });
        j++;
      } else {
        if (logs[i].createdAt > series[j].createdAt) {
          tmp.push({ type: "log", data: logs[i] });
          i++;
        } else {
          tmp.push({ type: "series", data: series[j] });
          j++;
        }
      }
    }

    setFeed(tmp);
  };

  const onCompleted = async (data: {
    getFeed: {
      logs: PhotologType[];
      series: SeriesType[];
    };
  }) => {
    // console.log(data);
    const { getFeed } = data;
    setFeedData({ logs: getFeed.logs ?? [], series: getFeed.series ?? [] });
  };

  const { loading, error, data, refetch, fetchMore } = useQuery(GET_FEED, {
    onCompleted,
  });

  useEffect(() => {
    if (data?.getFeed?.logs && data?.getFeed?.series) {
      setFeedData({
        logs: data?.getFeed?.logs ?? [],
        series: data?.getFeed?.series ?? [],
      });
    }
  }, [data]);

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUrl = (url: string) => {
    let { path, queryParams } = Linking.parse(url);
    if (path === "Profile") {
      if (Number(queryParams.id)) {
        navigation.push("Profile", { user: { id: Number(queryParams.id) } });
      }
    } else if (path === "Log") {
      if (Number(queryParams.id)) {
        navigation.push("Log", { id: Number(queryParams.id) });
      }
    }
  };

  const handleDeepLink = (event: any) => {
    if (event.url) {
      handleUrl(event.url);
    }
  };

  useEffect(() => {
    Linking.addEventListener("url", handleDeepLink);

    (async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        handleUrl(url);
      }
    })();

    return () => {
      Linking.removeEventListener("url", handleDeepLink);
    };
  }, []);

  const keyExtractor = (
    item:
      | {
          type: "log";
          data: PhotologType;
        }
      | {
          type: "series";
          data: SeriesType;
        }
  ) => item.type + item.data.id;

  return (
    <Container>
      <FlatList
        maxToRenderPerBatch={4}
        initialNumToRender={4}
        windowSize={4}
        data={feed}
        refreshing={refreshing}
        keyExtractor={keyExtractor}
        onEndReached={async () => {
          await fetchMore({
            variables: {
              lastLogId: data?.getFeed?.logs[data?.getFeed?.logs.length - 1].id,
              ...(data?.getFeed?.series &&
                data?.getFeed?.series.length !== 0 && {
                  lastSeriesId:
                    data?.getFeed?.series[data?.getFeed?.series.length - 1].id,
                }),
            },
          });
        }}
        onRefresh={refresh}
        renderItem={({ item, index }) =>
          item.type === "log" ? (
            <PhotoLog item={item.data} key={index} />
          ) : (
            <Series item={item.data} />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default Mainfeed;
