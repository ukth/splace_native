import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { formatDistance, keyword2Place, pixelScaler } from "../../utils";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16 } from "../../components/TextInput";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { FilterContext } from "../../contexts/Filter";
import { Icon } from "../../components/Icon";
import * as Location from "expo-location";
import ModalMapSplaceConfirm from "../../components/Search/ModalMapSplaceConfirm";

const EntryBackground = styled.View`
  width: ${pixelScaler(295)}px;
  height: ${pixelScaler(35)}px;
  margin-left: ${pixelScaler(25)}px;
  flex-direction: row;
  align-items: center;
  border-radius: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.searchBarBackground};
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

const SearchSplaceForFilter = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { filter, setFilter } = useContext(FilterContext);

  const [splace, setSplace] = useState();

  const theme = useContext<ThemeType>(ThemeContext);
  const [searchedAddress, setSearchedAddress] = useState<
    {
      id: string;
      distance: number;
      name: string;
      address: string;
      road_address: string;
      lon: number;
      lat: number;
    }[]
  >([]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState<{ lat: number; lon: number }>();

  const [showMap, setShowMap] = useState<boolean>(false);
  const [address, setAddress] = useState("");

  const [coordinate, setCoordinate] = useState<{ lat: number; lon: number }>();

  const [splaceSelected, setSplaceSelected] = useState(false);
  const [name, setName] = useState("");

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
            placeholder="지하철역, 장소명으로 지정해 보세요"
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

      let location = await Location.getLastKnownPositionAsync();

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
          ? await keyword2Place(keyword, location)
          : await keyword2Place(keyword);
        if (data.length > 0) {
          setSearchedAddress(data);
        }
      })();
    } else {
      setSearchedAddress([]);
    }
  }, [keyword, location]);

  useEffect(() => {
    if (splace) {
      if (splaceSelected) {
        setShowMap(true);
        setSplaceSelected(false);
      }
    }
  }, [splace, splaceSelected]);

  useEffect(() => {
    if (address !== "" && name !== "" && coordinate) {
      setShowMap(true);
    }
  }, [address, coordinate, name]);

  return (
    <ScreenContainer style={{ paddingHorizontal: pixelScaler(30) }}>
      <FlatList
        data={searchedAddress}
        keyExtractor={(_, index) => "" + index}
        ItemSeparatorComponent={Seperator}
        renderItem={({ item }) => (
          <AddressItemContainer
            onPress={() => {
              setAddress(
                item.road_address !== "" ? item.road_address : item.address
              );
              setName(item.name);
              setCoordinate({ lat: item.lat, lon: item.lon });
            }}
          >
            <InfoContainer>
              <BldText16
                style={{ width: pixelScaler(250), lineHeight: pixelScaler(24) }}
                numberOfLines={1}
              >
                {item.name}
              </BldText16>
              <RegText13
                style={{ width: pixelScaler(250), color: theme.greyTextAlone }}
                numberOfLines={1}
              >
                {item.road_address !== "" ? item.road_address : item.address}
              </RegText13>
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
        ListFooterComponent={<View style={{ height: pixelScaler(200) }} />}
      />
      <ModalMapSplaceConfirm
        showMap={showMap}
        setShowMap={setShowMap}
        coordinate={
          coordinate ?? {
            lon: 127.02959262855445,
            lat: 37.49944853514956,
          }
        }
        address={address}
        name={name}
      />
    </ScreenContainer>
  );
};

export default SearchSplaceForFilter;
