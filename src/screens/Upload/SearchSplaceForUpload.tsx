import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import {
  coords2address,
  formatDistance,
  keyword2Address,
  keyword2Place,
  pixelScaler,
} from "../../utils";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16 } from "../../components/TextInput";
import axios from "axios";
import { API_URL } from "../../apollo";
import { Alert, FlatList, TouchableOpacity, View } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import * as Location from "expo-location";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalMapSingleView from "../../components/ModalMapSingleView";
import { GET_SPLACE_BY_KAKAOID, REPORT, UPLOAD_MOMENT } from "../../queries";
import { ProgressContext } from "../../contexts/Progress";
import { UploadContentContext } from "../../contexts/UploadContent";
import ModalMapSplaceView from "../../components/Upload/ModalMapSplaceView";

const EntryBackground = styled.View`
  width: ${pixelScaler(295)}px;
  height: ${pixelScaler(40)}px;
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

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  height: ${pixelScaler(30)}px;
`;

const SearchSplaceForUpload = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { listHeaderRightText, onListHeaderRightPress, rootScreen } =
    useRoute<RouteProp<StackGeneratorParamList, "SearchSplaceForUpload">>()
      .params;

  const { content, setContent } = useContext(UploadContentContext);
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
  const [text, setText] = useState("");

  const [showMap, setShowMap] = useState<boolean>(false);
  const [address, setAddress] = useState("");

  const [coordinate, setCoordinate] = useState({
    lon: 127.02959262855445,
    lat: 37.49944853514956,
  });

  const { spinner } = useContext(ProgressContext);
  const [splaceSelected, setSplaceSelected] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => (
        <EntryBackground>
          <Ionicons
            name="search"
            size={30}
            style={{ marginLeft: pixelScaler(10) }}
            color={theme.entryPlaceholder}
          />
          <BldTextInput16
            onChangeText={(text) => {
              setKeyword(text);
            }}
            placeholder="장소/이벤트를 검색해보세요"
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

  const onCompleted = (data: any) => {
    spinner.stop();
    console.log(data);
    // console.log(data);
    if (data?.getSplaceByKakao?.ok) {
      // console.log(data.getSplaceByKakao.splace);
      setSplace(data.getSplaceByKakao.splace);
    } else {
      Alert.alert("위치정보를 불러오지 못했습니다.");
    }
  };

  useEffect(() => {
    if (splace) {
      if (splaceSelected) {
        setShowMap(true);
        setSplaceSelected(false);
      }
    }
  }, [splace, splaceSelected]);

  const [mutation, { loading }] = useMutation(GET_SPLACE_BY_KAKAOID, {
    onCompleted,
  });

  return (
    <ScreenContainer style={{ paddingHorizontal: pixelScaler(30) }}>
      <LabelContainer>
        {location && (
          <TouchableOpacity
            onPress={() => onListHeaderRightPress({ location })}
          >
            <RegText13 style={{ color: theme.textHighlight }}>
              {listHeaderRightText}
            </RegText13>
          </TouchableOpacity>
        )}
      </LabelContainer>
      <FlatList
        data={searchedAddress}
        keyExtractor={(_, index) => "" + index}
        ItemSeparatorComponent={Seperator}
        renderItem={({ item }) => (
          <AddressItemContainer
            onPress={() => {
              (async () => {
                if (!loading) {
                  setSplace(undefined);
                  setSplaceSelected(true);
                  spinner.start();
                  console.log("mutation!!");
                  mutation({
                    variables: {
                      kakaoId: Number(item.id),
                      keyword: item.name,
                    },
                  });
                }
              })();
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
                  style={{ position: "absolute", right: 0, bottom: 0 }}
                >
                  {formatDistance(item.distance)}
                </RegText13>
              ) : null}
            </InfoContainer>
          </AddressItemContainer>
        )}
        ListFooterComponent={<View style={{ height: pixelScaler(200) }} />}
      />
      <ModalMapSplaceView
        splace={splace}
        showMap={showMap}
        setShowMap={setShowMap}
        rootScreen={rootScreen}
      />
    </ScreenContainer>
  );
};

export default SearchSplaceForUpload;
