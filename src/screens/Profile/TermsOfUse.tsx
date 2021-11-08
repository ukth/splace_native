import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import ScreenContainer from "../../components/ScreenContainer";
import { BldText16, RegText16 } from "../../components/Text";
import { StackGeneratorParamList } from "../../types";

const TermsOfUse = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>이용 약관</BldText16>,
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, []);
  return (
    <ScreenContainer>
      <RegText16>이용 약관 내용</RegText16>
    </ScreenContainer>
  );
};

export default TermsOfUse;
