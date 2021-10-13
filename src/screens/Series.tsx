import React, { useContext, useEffect } from "react";
import { GET_SERIES, GET_SERIES_INFO } from "../queries";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import {
  PhotologType,
  SplaceType,
  StackGeneratorParamList,
  themeType,
} from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { useNavigation } from "@react-navigation/native";
import {
  BldText13,
  BldText16,
  BldText20,
  RegText13,
  RegText20,
} from "../components/Text";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { FlatList, TouchableOpacity, View } from "react-native";
import ScreenContainer from "../components/ScreenContainer";
import PhotoLog from "../components/Contents/Photolog";
import ModalMapView from "./ModalMapView";
import { FloatingMapButton } from "../components/FloatingMapButton";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp, useRoute } from "@react-navigation/core";
import ThreeDots from "../components/ThreeDots";
import BottomSheetModal from "../components/BottomSheetModal";
import ModalButtonBox from "../components/ModalButtonBox";

const Header = styled.View`
  align-items: center;
  justify-content: center;
`;

const Series = () => {
  const route = useRoute<RouteProp<StackGeneratorParamList, "Series">>();
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const seriesId = route.params.id;

  const [showMap, setShowMap] = useState(false);
  const [splaces, setSplaces] = useState<SplaceType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const theme = useContext<themeType>(ThemeContext);

  const { data: seriesInfo } = useQuery(GET_SERIES_INFO, {
    variables: { seriesId },
  });

  useEffect(() => {
    // console.log(seriesInfo);
    navigation.setOptions({
      headerTitle: () => (
        <Header>
          <BldText16 style={{ marginBottom: pixelScaler(5) }}>
            {seriesInfo?.seeSeries?.series?.title}
          </BldText16>
          <TouchableOpacity>
            <BldText13
              style={{
                color: theme.seriesHeaderGreyText,
              }}
            >
              {seriesInfo?.seeSeries?.series?.author?.username}
            </BldText13>
          </TouchableOpacity>
        </Header>
      ),
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.pop();
          }}
        />
      ),
      headerRight: () => <ThreeDots onPress={() => setModalVisible(true)} />,
    });
  }, [seriesInfo]);

  const onGetLogsCompleted = async (data: {
    getLogsBySeries: {
      logs: PhotologType[];
      ok: boolean;
    };
  }) => {
    // console.log(data);
    if (data?.getLogsBySeries?.ok) {
      setSplaces(
        data?.getLogsBySeries?.logs
          .map((log: PhotologType) => log.splace)
          .filter((item: any) => item !== null)
      );
    }
  };

  const { data: logsData } = useQuery(GET_SERIES, {
    variables: { seriesId },
    onCompleted: onGetLogsCompleted,
  });

  return (
    <ScreenContainer>
      <FlatList
        ListHeaderComponent={<View style={{ height: pixelScaler(30) }}></View>}
        keyExtractor={(item) => "" + item.id}
        data={logsData?.getLogsBySeries?.logs}
        renderItem={({ item, index }) => (
          <PhotoLog item={item} key={index} type="Series" />
        )}
      />
      {splaces.length > 0 ? (
        <ModalMapView
          showMap={showMap}
          setShowMap={setShowMap}
          splaces={splaces}
        />
      ) : null}
      {splaces.length > 0 ? (
        <FloatingMapButton onPress={() => setShowMap(true)}>
          <Ionicons name="map-outline" size={30} />
        </FloatingMapButton>
      ) : null}
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        <ModalButtonBox>
          <RegText20>링크 복사</RegText20>
        </ModalButtonBox>
        <ModalButtonBox onPress={() => {}}>
          <RegText20>공유</RegText20>
        </ModalButtonBox>
        <ModalButtonBox>
          <RegText20 style={{ color: "#00A4B7" }}>
            저장된 게시물에 추가
          </RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
    </ScreenContainer>
  );
};

export default Series;
