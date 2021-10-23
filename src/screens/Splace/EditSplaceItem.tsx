import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList } from "../../types";
import styled from "styled-components/native";
import { BldText16, RegText33 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { TouchableOpacity } from "react-native";

const EditSplaceItem = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace, urls }: { splace: SplaceType; urls?: string[] } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplace">>().params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>편집모드</BldText16>,
      headerRight: () => <HeaderRightConfirm onPress={() => {}} />,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  return (
    <ScreenContainer>
      <TouchableOpacity
        style={{ width: 100, height: 100, backgroundColor: "#90f0d0" }}
        onPress={() => navigation.navigate("Splace", { splace })}
      >
        <RegText33>어나라ㅓㅇㄴ</RegText33>
      </TouchableOpacity>
    </ScreenContainer>
  );
};

export default EditSplaceItem;
