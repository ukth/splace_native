import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList } from "../../types";
import styled from "styled-components/native";
import { BldText16 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";

const ScreenName = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplace">>().params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>편집모드</BldText16>,
      headerRight: () => <HeaderRightConfirm onPress={() => {}} />,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);

  return <ScreenContainer></ScreenContainer>;
};

export default ScreenName;
