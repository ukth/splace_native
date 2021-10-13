import { RouteProp, useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";

import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, GestureResponderEvent, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import {
  GreyButtonComponent,
  MemberComponent,
  Seperator,
} from "../components/Members";
import ScreenContainer from "../components/ScreenContainer";
import { BldText13, BldText16, BldText20, RegText13 } from "../components/Text";
import { StackGeneratorParamList, themeType, UserType } from "../types";
import { pixelScaler } from "../utils";

const Members = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<StackGeneratorParamList>;
  route: RouteProp<StackGeneratorParamList, "Members">;
}) => {
  const theme = useContext<themeType>(ThemeContext);

  const {
    title,
    vars,
    membersData,
    refetchMembers,
    inviteMutation,
    leaveMutation,
  } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>{title}</BldText16>,
    });
  }, []);

  const [members, setMembers] = useState<UserType[]>(membersData);

  const [refreshing, setRefreshing] = useState(false);

  const updateMembers = async () => {
    const { data } = await refetchMembers();
    console.log(data);
    if (data?.getRoomInfo?.ok) {
      setMembers(data.getRoomInfo.room.members);
    } else if (data?.seeFolder?.ok) {
      setMembers(data.seeFolder.folder.members);
    }
    console.log(members, "!!!!!");
  };

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    await updateMembers();
    clearTimeout(timer);
    setRefreshing(false);
  };

  navigation.addListener("focus", async () => {
    await updateMembers();
  });

  return (
    <ScreenContainer>
      <FlatList
        data={members}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item }) => <MemberComponent user={item} />}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            <GreyButtonComponent
              type={"+"}
              onPress={() =>
                navigation.push("AddMembers", {
                  vars,
                  members,
                  inviteMutation,
                })
              }
            />
            <Seperator />
          </View>
        )}
        onRefresh={refresh}
        refreshing={refreshing}
        ItemSeparatorComponent={() => <Seperator />}
        ListFooterComponent={() => (
          <View>
            <Seperator />
            <GreyButtonComponent
              type={"-"}
              onPress={() => leaveMutation({ variables: { ...vars } })}
            />
          </View>
        )}
      />
    </ScreenContainer>
  );
};

export default Members;
