import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import {
  calcDistanceByCoords,
  formatDistance,
  keyword2Address,
  pixelScaler,
} from "../../utils";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16 } from "../../components/TextInput";
import axios from "axios";
import { API_URL } from "../../apollo";
import { Alert, FlatList, View } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import * as Location from "expo-location";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalMapSingleView from "../../components/ModalMapSingleView";
import { REPORT } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";
import { Icon } from "../../components/Icon";

const EntryBackground = styled.View`
  width: ${pixelScaler(280)}px;
  height: ${pixelScaler(40)}px;
  flex-direction: row;
  align-items: center;
  border-radius: ${pixelScaler(10)}px;
`;

const AddressItemContainer = styled.TouchableOpacity`
  height: ${pixelScaler(75)}px;
  width: ${pixelScaler(315)}px;
  justify-content: center;
`;

const InfoContainer = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(40)}px;
  justify-content: center;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const EditSplaceLocationSearch = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { splace }: { splace: SplaceType } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSplaceLocationSearch">>()
      .params;

  const theme = useContext<ThemeType>(ThemeContext);
  const [searchedAddress, setSearchedAddress] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<{ lat: number; lon: number }>();

  const [showMap, setShowMap] = useState<boolean>(false);
  const [address, setAddress] = useState("");

  const [coordinate, setCoordinate] = useState({
    lon: 127.02959262855445,
    lat: 37.49944853514956,
  });

  const { spinner } = useContext(ProgressContext);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => (
        <EntryBackground>
          <Icon
            name="search_grey"
            style={{
              width: pixelScaler(20),
              height: pixelScaler(20),
              marginLeft: pixelScaler(10),
            }}
          />
          <BldTextInput16
            onChangeText={(text) => {
              setKeyword(text);
            }}
            placeholder="정확한 주소로 검색해보세요."
            placeholderTextColor={theme.entryPlaceholder}
            style={{
              marginLeft: pixelScaler(10),
              width: pixelScaler(250),
            }}
            selectionColor={theme.entrySelection}
          />
        </EntryBackground>
      ),
    });
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "splace는 위치정보가 필요합니다. 설정에서 권한을 부여해주세요."
        );
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      // console.log(location);
      if (location) {
        setLocation({
          lat: location.coords.latitude,
          lon: location.coords.longitude,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (keyword !== "") {
      (async () => {
        const data = location
          ? await keyword2Address(keyword, location)
          : await keyword2Address(keyword);
        if (data.length > 0) {
          setSearchedAddress(data);
        }
      })();
    } else {
      setSearchedAddress([]);
    }
  }, [keyword, location]);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.reportResources?.ok) {
      Alert.alert(
        "",
        "신청이 접수되었습니다.\n검토까지 24-72시간이 소요되며,\n이후 확인 절차가 메세지로 안내됩니다.",
        [
          {
            text: "확인",
            onPress: () => {
              setShowMap(false);
              navigation.pop();
            },
          },
        ]
      );
    } else if (data.reportResources?.error === "ERROR3P11") {
      Alert.alert(
        "해당 Splace에 이미 접수된 위치 변경 요청이 존재합니다.",
        "",
        [
          {
            text: "확인",
            onPress: () => {
              setShowMap(false);
              navigation.pop();
            },
          },
        ]
      );
    } else {
      Alert.alert(
        "",
        "위치 업데이트 요청에 실패했습니다.\ncontact@lunen.co.kr로 문의해주세요.",
        [
          {
            text: "확인",
            onPress: () => {
              setShowMap(false);
              navigation.pop();
            },
          },
        ]
      );
    }
  };

  const [mutation, { loading }] = useMutation(REPORT, { onCompleted });

  return (
    <ScreenContainer style={{ paddingHorizontal: pixelScaler(30) }}>
      <FlatList
        data={searchedAddress}
        keyExtractor={(_, index) => "" + index}
        ItemSeparatorComponent={Seperator}
        renderItem={({ item }: { item: any }) => (
          <AddressItemContainer
            onPress={() => {
              (async () => {
                setCoordinate({ lon: Number(item.x), lat: Number(item.y) });
                setAddress(item.roadAddress);
                setShowMap(true);
              })();
            }}
          >
            <InfoContainer>
              <RegText16 style={{ width: pixelScaler(275) }}>
                {item.roadAddress}
              </RegText16>
              {item.distance !== 0 ? (
                <RegText13
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    color: theme.greyTextAlone,
                  }}
                >
                  {formatDistance(item.distance)}
                </RegText13>
              ) : null}
            </InfoContainer>
          </AddressItemContainer>
        )}
      />
      <ModalMapSingleView
        showMap={showMap}
        setShowMap={setShowMap}
        coordinate={coordinate}
        address={address}
        onConfirm={() => {
          if (!loading) {
            spinner.start();
            mutation({
              variables: {
                sourceType: "splace location edit",
                sourceId: splace.id,
                reason:
                  "lat:" +
                  coordinate.lat +
                  ",lon:" +
                  coordinate.lon +
                  "," +
                  address,
              },
            });
          }
        }}
      />
    </ScreenContainer>
  );
};

export default EditSplaceLocationSearch;
