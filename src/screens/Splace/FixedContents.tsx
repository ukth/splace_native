import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList } from "../../types";
import styled from "styled-components/native";
import { pixelScaler } from "../../utils";
import { BldText16 } from "../../components/Text";
import { bigCategories } from "../../constants";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { FlatList, Image, TouchableOpacity, View } from "react-native";
import FixedContent from "../../components/Splace/FixedContent";
import { Icons } from "../../icons";
import { HeaderRightAdd } from "../../components/HeaderRightAdd";
import { GET_SPLACE_INFO } from "../../queries";

const FixedContents = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const [splace, setSplace] = useState(
    useRoute<RouteProp<StackGeneratorParamList, "FixedContents">>().params
      .splace
  );

  const { refetch } = useQuery(GET_SPLACE_INFO, {
    variables: { splaceId: splace.id },
  });

  navigation.addListener("focus", async () => {
    const refetched = await refetch();
    console.log(refetched);
    if (refetched?.data?.seeSplace?.ok) {
      setSplace(refetched.data?.seeSplace.splace);
    }
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>{splace.name}</BldText16>,
      headerRight: () => (
        <HeaderRightAdd
          onPress={() => {
            navigation.push("AddFixedContents", { splace });
          }}
        />
      ),
    });
  }, []);

  return (
    <ScreenContainer>
      <FlatList
        ListHeaderComponent={<View style={{ height: pixelScaler(30) }} />}
        data={splace.fixedContents}
        renderItem={({ item }) => <FixedContent item={item} splace={splace} />}
        keyExtractor={(item) => item.id + ""}
      />
    </ScreenContainer>
  );
};

export default FixedContents;
