import React, { useState, useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import PhotoLog from "../components/Contents/Photolog";
import { PhotologType, StackGeneratorParamList } from "../types";
import { useQuery } from "@apollo/client";
import { GET_LOG } from "../queries";

const Log = () => {
  const navigation = useNavigation();
  const { id } = useRoute<RouteProp<StackGeneratorParamList, "Log">>().params;
  const [item, setItem] = useState<PhotologType>();

  const onCompleted = (data: any) => {
    if (data?.seePhotolog?.ok) {
      setItem(data?.seePhotolog?.log);
    }
  };

  const { data, loading } = useQuery(GET_LOG, {
    variables: { photologId: id },
    onCompleted,
  });

  return (
    <ScreenContainer>{item ? <PhotoLog item={item} /> : null}</ScreenContainer>
  );
};

export default Log;
