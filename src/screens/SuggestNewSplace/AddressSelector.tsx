import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { formatDistance, keyword2Address, pixelScaler } from "../../utils";
import { BldTextInput16 } from "../../components/TextInput";
import { Alert, FlatList, View } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import * as Location from "expo-location";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalMapSingleView from "../../components/ModalMapSingleView";
import { Icon } from "../../components/Icon";

const EntryBackground = styled.View`
  width: ${pixelScaler(290)}px;
  height: ${pixelScaler(35)}px;
  margin-left: ${pixelScaler(25)}px;
  flex-direction: row;
  align-items: center;
  border-radius: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
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
  /* background-color: #9d0; */
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const AddressSelector = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const {
    onConfirm,
  }: {
    onConfirm: ({
      address,
      lat,
      lon,
    }: {
      address: string;
      lat: number;
      lon: number;
    }) => void;
  } = useRoute<RouteProp<StackGeneratorParamList, "AddressSelector">>().params;

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
              marginLeft: pixelScaler(15),
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
      headerStyle: {
        shadowColor: "transparent",
      },
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
              <RegText16
                style={{ width: pixelScaler(275), lineHeight: pixelScaler(20) }}
              >
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
          onConfirm({ address, lat: coordinate.lat, lon: coordinate.lon });
        }}
      />
    </ScreenContainer>
  );
};

export default AddressSelector;
