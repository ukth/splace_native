import { useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { MemberComponent, Seperator } from "../../components/Members";
import ScreenContainer from "../../components/ScreenContainer";
import { BldTextInput16 } from "../../components/TextInput";
import useMe from "../../hooks/useMe";
import { GET_FOLLOWERS, GET_FOLLOWINGS } from "../../queries";

import { StackGeneratorParamList, ThemeType, UserType } from "../../types";

const ProfileUsers = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
  route: RouteProp<StackGeneratorParamList, "ProfileUsers">;
}) => {
  const { type, user } = route.params;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <BldTextInput16>
          {type === "followers" ? "팔로워" : "팔로잉"}
        </BldTextInput16>
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  const { data, refetch, fetchMore } = useQuery(
    type === "followers" ? GET_FOLLOWERS : GET_FOLLOWINGS,
    {
      variables: {
        userId: user.id,
      },
    }
  );

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

  navigation.addListener("focus", async () => {
    await refetch();
  });

  return (
    <ScreenContainer>
      <FlatList
        data={
          type === "followers"
            ? data?.seeFollowers?.followers
            : data?.seeFollowings?.followings
        }
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item }) => <MemberComponent user={item} />}
        showsVerticalScrollIndicator={false}
        onRefresh={refresh}
        refreshing={refreshing}
        ItemSeparatorComponent={() => <Seperator />}
        onEndReached={async () => {
          await fetchMore({
            variables: {
              userId: user.id,
              lastId:
                type === "followers"
                  ? data?.seeFollowers?.followers[
                      data?.seeFollowers?.followers?.length - 1
                    ].id
                  : data?.seeFollowings?.followings[
                      data?.seeFollowings?.followings?.length - 1
                    ].id,
            },
          });
        }}
      />
    </ScreenContainer>
  );
};

export default ProfileUsers;
