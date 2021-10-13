import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useRef, useState } from "react";
import { HeaderBackButton } from "../../components/HeaderBackButton";

import ScreenContainer from "../../components/ScreenContainer";
import { RegText16 } from "../../components/Text";
import { StackGeneratorParamList } from "../../types";

const TermsOfUse = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      title: "이용 약관",
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
