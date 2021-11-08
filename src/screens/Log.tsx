import React, { useState, useEffect, useRef } from "react";
import { useWindowDimensions } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import PhotoLog from "../components/Contents/Photolog";
import { PhotologType, StackGeneratorParamList } from "../types";
import { useMutation, useQuery } from "@apollo/client";
import { GET_LOG, LOG_GETPHOTOLOG } from "../queries";
import { StackNavigationProp } from "@react-navigation/stack";
import { BldText16 } from "../components/Text";

const Log = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
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

  const [log_getLog, _1] = useMutation(LOG_GETPHOTOLOG);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>업로드된 게시물</BldText16>,
    });
    try {
      log_getLog({ variables: { photologId: id } });
    } catch {}
  }, []);

  return (
    <ScreenContainer>{item ? <PhotoLog item={item} /> : null}</ScreenContainer>
  );
};

export default Log;
