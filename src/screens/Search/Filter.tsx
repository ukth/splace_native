import React, {
  LegacyRef,
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigation } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  BigCategoryType,
  RatingtagType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { FilterContext } from "../../contexts/Filter";
import {
  coords2address,
  formatDistance,
  formatFilterDistance,
  pixelScaler,
} from "../../utils";
import { Alert, ScrollView, Switch, View } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { TouchableOpacity } from "react-native-gesture-handler";
import * as Location from "expo-location";
import Slider, { SliderRef } from "@react-native-community/slider";
import { Icon } from "../../components/Icon";
import { useQuery } from "@apollo/client";
import { GET_BIGCATEGORIES } from "../../queries";
import { ratingtags } from "../../constants";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { BldTextInput16 } from "../../components/TextInput";
import { HeaderBackButton } from "../../components/HeaderBackButton";

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FiltersDeactivate = styled.View`
  position: absolute;
  z-index: 1;
  width: ${pixelScaler(330)}px;
  height: ${pixelScaler(600)}px;
  background-color: rgba(255, 255, 255, 0.8);
`;

const LocationSelector = styled.TouchableOpacity`
  flex-direction: row;
  width: auto;
  height: ${pixelScaler(35)}px;
  align-items: center;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.searchBarBackground};
  border-radius: ${pixelScaler(10)}px;
  margin-bottom: ${pixelScaler(45)}px;
`;

const TagsContainer = styled.View`
  flex-direction: row;
  width: ${pixelScaler(325)}px;
  flex-wrap: wrap;
  margin-bottom: ${pixelScaler(37)}px;
`;

const Tag = styled.TouchableOpacity`
  border-width: ${pixelScaler(0.67)}px;
  padding: 0 ${pixelScaler(10)}px;
  justify-content: center;
  height: ${pixelScaler(25)}px;
  border-radius: ${pixelScaler(25)}px;
  margin-right: ${pixelScaler(5)}px;
  margin-bottom: ${pixelScaler(15)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const Filter = () => {
  const [location, setLocation] = useState<{ lat: number; lon: number }>();
  const sliderRef = useRef<any>();

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { filter, setFilter, filterActivated, setFilterActivated } =
    useContext(FilterContext);

  const [slidervalue, setSliderValue] = useState(filter.distance);
  const theme = useContext<ThemeType>(ThemeContext);

  const { data } = useQuery(GET_BIGCATEGORIES);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldTextInput16>검색 필터 설정</BldTextInput16>,
      headerRight: () => (
        <HeaderRightConfirm
          text="초기화"
          onPress={() => {
            setFilter({
              exceptNoKids: false,
              pets: false,
              parking: false,
              distance: 1.4,
              bigCategoryIds: [],
              ratingtagIds: [],
            });
            setSliderValue(1.4);
          }}
        />
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
    navigation.setOptions({
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            setFilter({
              ...filter,
              distance: slidervalue,
            });
            navigation.pop();
          }}
        />
      ),
    });
  }, [filter, slidervalue]);

  return (
    <ScrollView style={{ backgroundColor: theme.background }}>
      <ScreenContainer
        style={{
          paddingTop: pixelScaler(30),
          paddingHorizontal: pixelScaler(30),
        }}
      >
        <LabelContainer style={{ marginBottom: pixelScaler(22) }}>
          <BldText16>필터 {filterActivated ? "ON" : "OFF"}</BldText16>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={filterActivated}
            onValueChange={(value) => setFilterActivated(value)}
          />
        </LabelContainer>
        <View>
          {filterActivated ? null : <FiltersDeactivate />}
          <LabelContainer style={{ marginBottom: pixelScaler(15) }}>
            <BldText16>검색위치</BldText16>
            <TouchableOpacity
              onPress={() => {
                if (location) {
                  (async () => {
                    const address = await coords2address({
                      lat: location.lat,
                      lon: location.lon,
                    });
                    setFilter({
                      ...filter,
                      lat: location.lat,
                      lon: location.lon,
                      locationText: address,
                    });
                  })();
                } else {
                  Alert.alert("현재 위치를 불러올 수 없습니다.");
                }
              }}
            >
              {location ? (
                <RegText13 style={{ color: theme.textHighlight }}>
                  현재 위치로 설정
                </RegText13>
              ) : null}
            </TouchableOpacity>
          </LabelContainer>
          <LocationSelector
            onPress={() => {
              navigation.push("SearchSplaceForFilter");
            }}
          >
            <Icon
              name="search_grey"
              style={{
                width: pixelScaler(20),
                height: pixelScaler(20),
                marginLeft: pixelScaler(15),
              }}
            />
            <RegText16
              style={{
                marginLeft: pixelScaler(8),
                marginTop: pixelScaler(1.3),
                color: filter.locationText ? theme.text : theme.greyTextLight,
              }}
            >
              {filter.locationText ?? "지하철역, 장소명으로 지정해 보세요"}
            </RegText16>
          </LocationSelector>
          <LabelContainer>
            <BldText16>검색반경</BldText16>
            <RegText13>{formatFilterDistance(slidervalue)}</RegText13>
          </LabelContainer>
          <Slider
            ref={sliderRef}
            style={{
              width: pixelScaler(315),
              height: pixelScaler(40),
              marginBottom: pixelScaler(35),
            }}
            value={filter.distance}
            minimumValue={0}
            maximumValue={1.4}
            minimumTrackTintColor={theme.themeBackground}
            maximumTrackTintColor={theme.greyBackground}
            onValueChange={(value) => {
              setSliderValue(value);
            }}
            step={0.02}
          />
          <LabelContainer style={{ marginBottom: pixelScaler(15) }}>
            <BldText16>카테고리</BldText16>
          </LabelContainer>
          <TagsContainer>
            {ratingtags.map((ratingtag: RatingtagType) => (
              <Tag
                key={ratingtag.id + "rat"}
                style={
                  filter.ratingtagIds.includes(ratingtag.id)
                    ? {
                        backgroundColor: theme.themeBackground,
                        borderColor: theme.themeBackground,
                      }
                    : {
                        borderColor: theme.borderHighlight,
                      }
                }
                onPress={() => {
                  const tmp = [...filter.ratingtagIds];
                  const idx = tmp.indexOf(ratingtag.id);
                  if (idx !== -1) {
                    tmp.splice(idx, 1);
                    setFilter({ ...filter, ratingtagIds: tmp });
                  } else {
                    setFilter({
                      ...filter,
                      ratingtagIds: [...tmp, ratingtag.id],
                    });
                  }
                }}
              >
                <RegText16
                  style={
                    filter.ratingtagIds.includes(ratingtag.id)
                      ? {
                          color: theme.white,
                        }
                      : { color: theme.textHighlight }
                  }
                >
                  {ratingtag.name}
                </RegText16>
              </Tag>
            ))}
            {data?.getBigCategories?.bigCategories?.map(
              (bigCategory: BigCategoryType) => (
                <Tag
                  key={bigCategory.id + "big"}
                  style={
                    filter.bigCategoryIds.includes(bigCategory.id)
                      ? {
                          backgroundColor: theme.themeBackground,
                          borderColor: theme.themeBackground,
                        }
                      : {}
                  }
                  onPress={() => {
                    const tmp = [...filter.bigCategoryIds];
                    const idx = tmp.indexOf(bigCategory.id);
                    if (idx !== -1) {
                      tmp.splice(idx, 1);
                      setFilter({ ...filter, bigCategoryIds: tmp });
                    } else {
                      setFilter({
                        ...filter,
                        bigCategoryIds: [...tmp, bigCategory.id],
                      });
                    }
                  }}
                >
                  <RegText16
                    style={
                      filter.bigCategoryIds.includes(bigCategory.id)
                        ? {
                            color: theme.white,
                          }
                        : {}
                    }
                  >
                    {bigCategory.name}
                  </RegText16>
                </Tag>
              )
            )}
          </TagsContainer>
          <LabelContainer style={{ marginBottom: pixelScaler(15) }}>
            <BldText16>반려동물 출입 가능</BldText16>
            <Switch
              trackColor={{
                false: theme.switchTrackFalse,
                true: theme.themeBackground,
              }}
              style={{ marginLeft: pixelScaler(15) }}
              value={filter.pets}
              onValueChange={(value) => setFilter({ ...filter, pets: value })}
            />
          </LabelContainer>
          <LabelContainer style={{ marginBottom: pixelScaler(15) }}>
            <BldText16>No kids zone 제외</BldText16>
            <Switch
              trackColor={{
                false: theme.switchTrackFalse,
                true: theme.themeBackground,
              }}
              style={{ marginLeft: pixelScaler(15) }}
              value={filter.exceptNoKids}
              onValueChange={(value) =>
                setFilter({ ...filter, exceptNoKids: value })
              }
            />
          </LabelContainer>
          <LabelContainer style={{ marginBottom: pixelScaler(15) }}>
            <BldText16>주차가능</BldText16>
            <Switch
              trackColor={{
                false: theme.switchTrackFalse,
                true: theme.themeBackground,
              }}
              style={{ marginLeft: pixelScaler(15) }}
              value={filter.parking}
              onValueChange={(value) =>
                setFilter({ ...filter, parking: value })
              }
            />
          </LabelContainer>
        </View>
      </ScreenContainer>
    </ScrollView>
  );
};

export default Filter;
