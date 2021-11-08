import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import ScreenContainer from "../../components/ScreenContainer";
import { BldText16, RegText16 } from "../../components/Text";
import { StackGeneratorParamList } from "../../types";

const Agreement = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>3자 개인정보 제공 동의"</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);
  return (
    <ScreenContainer>
      <RegText16>3자 개인정보 제공 동의 내용</RegText16>
    </ScreenContainer>
  );
};

export default Agreement;
