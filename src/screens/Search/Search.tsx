import React, { useEffect, useState, useRef } from "react";
import {
  useWindowDimensions,
  View,
  Image,
  Alert,
  Keyboard,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
  UserType,
} from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { convertNumber, pixelScaler, shortenAddress } from "../../utils";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import Preview from "../../components/Search/Preview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  LOG_SEARCHCATEORIES,
  LOG_SEARCHSPLACES,
  SEARCH_CATEGORY,
  SEARCH_SPLACE,
  SEARCH_USER,
} from "../../queries";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
} from "../../components/Text";
import { Icon } from "../../components/Icon";
import { BldTextInput16, RegTextInput16 } from "../../components/TextInput";
import ScreenContainer from "../../components/ScreenContainer";
import { FilterContext } from "../../contexts/Filter";
import { Item } from "../../components/Folder";
import { Ionicons } from "@expo/vector-icons";
import { ProgressContext } from "../../contexts/Progress";
import { ModalKeep } from "../../components/ModalKeep";
import { FloatingMapButton } from "../../components/FloatingMapButton";
import ModalMapSplaceView from "../../components/ModalMapSplaceView";
import ModalMapView from "../../components/ModalMapView";
import { BLANK_IMAGE, BLANK_PROFILE_IMAGE } from "../../constants";
// import { TextInput } from "react-native-gesture-handler";

const HeaderContainer = styled.View`
  align-items: center;
`;

const TabBar = styled.View`
  width: 100%;
  height: ${pixelScaler(45)}px;
  padding: 0 ${pixelScaler(35)}px;
  flex-direction: row;
  justify-content: space-between;
`;

const TabBarBottomBorder = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.33)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const TopTab = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
  border-bottom-width: ${({
    theme,
    focused,
  }: {
    theme: ThemeType;
    focused: boolean;
  }) => (focused ? 1 : 0)}px;
  padding-bottom: ${pixelScaler(10)}px;
`;

const HeaderEntryContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${pixelScaler(375)}px;
  height: ${pixelScaler(35)}px;
  padding-right: ${pixelScaler(30)}px;
  padding-left: ${pixelScaler(30)}px;
`;
const SearchBar = styled.View`
  flex: 1;
  height: ${pixelScaler(35)}px;
  border-radius: ${pixelScaler(10)}px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.searchBarBackground};
  padding-top: ${pixelScaler(1.3)}px;
`;

const Tag = styled.View`
  height: ${pixelScaler(25)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-width: ${pixelScaler(0.67)}px;
  align-items: center;
  justify-content: center;
  padding-top: ${pixelScaler(1.3)}px;
  margin-right: ${pixelScaler(9)}px;
`;

const SplaceItemContainer = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(225)}px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${pixelScaler(11)}px;
  align-items: center;
  width: ${pixelScaler(145)}px;
`;
const TagsContainer = styled.View`
  flex-direction: row;
`;

const ListItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  /* flex: 1; */
  height: ${pixelScaler(60)}px;
`;

const CloseButton = styled.TouchableOpacity`
  width: ${pixelScaler(35)}px;
  align-items: center;
  justify-content: center;
`;

const SearchModeSelector = styled.View`
  height: ${pixelScaler(50)}px;
  padding-left: ${pixelScaler(30)}px;
  flex-direction: row;
  align-items: center;
`;

const SearchModeButton = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(3)}px;
  margin-right: ${pixelScaler(10)}px;
  margin-bottom: ${pixelScaler(5)}px;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const BlankMessageContainer = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Search = () => {
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const theme = useContext<ThemeType>(ThemeContext);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const [tabViewIndex, setTabViewIndex] = useState<0 | 1 | 2>(0);

  const [splaceHistory, setSplaceHistory] = useState<string[]>([]);

  const [history, setHistory] = useState<string[]>([]);

  const [keyword, setKeyword] = useState<string>("");
  const [splaceSearched, setSplaceSearched] = useState(false);

  const { filter, setFilter, filterActivated } = useContext(FilterContext);

  const { spinner } = useContext(ProgressContext);

  const [searchVars, setSearchVars] = useState({});
  const [splaceSearchType, setSplaceSearchType] = useState<
    "splace" | "photolog"
  >("splace");

  const [modalKeepVisible, setModalKeepVisible] = useState(false);
  const [splaceId, setSplaceId] = useState(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [showMap, setShowMap] = useState(false);

  const entryRef = useRef<any>();

  const [searchedSplaces, setSearchedSplaces] = useState<
    {
      address: string;
      bigCategories: string | null;
      id: number;
      location: string;
      name: string;
      stringBC: string | null;
      thumbnail: string | null;
      isSaved: boolean;
    }[]
  >([]);

  const [searchedLogs, setSearchedLogs] = useState<
    {
      id: number;
      thumbnail: string | null;
    }[]
  >([]);

  const [log_searchCategory, _1] = useMutation(LOG_SEARCHCATEORIES);
  const [log_searchSplace, _2] = useMutation(LOG_SEARCHSPLACES);

  const onCompleted = (data: any) => {
    if (keyword !== "") {
      setSplaceSearched(true);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);

    const res = await refetchSplaces();

    if (res?.data?.searchSplaces?.ok) {
      if (splaceSearchType === "splace") {
        setSearchedSplaces(res.data.searchSplaces.searchedSplaces ?? []);
        setSplaceSearched(true);
      } else {
        setSearchedLogs(res.data.searchSplaces.searchedSplaces ?? []);
        setSplaceSearched(true);
      }
    }

    clearTimeout(timer);
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <HeaderContainer>
          {searchBarFocused && !splaceSearched ? (
            <>
              <TabBar>
                <TopTab
                  focused={tabViewIndex === 0}
                  onPress={() => {
                    setTabViewIndex(0);
                    setKeyword("");
                  }}
                >
                  {tabViewIndex === 0 ? (
                    <BldText16>공간</BldText16>
                  ) : (
                    <RegText16 style={{ color: theme.tabBarGrey }}>
                      공간
                    </RegText16>
                  )}
                </TopTab>
                <TopTab
                  focused={tabViewIndex === 1}
                  onPress={() => {
                    setTabViewIndex(1);
                    setKeyword("");
                  }}
                >
                  {tabViewIndex === 1 ? (
                    <BldText16>카테고리</BldText16>
                  ) : (
                    <RegText16 style={{ color: theme.tabBarGrey }}>
                      카테고리
                    </RegText16>
                  )}
                </TopTab>
                <TopTab
                  focused={tabViewIndex === 2}
                  onPress={() => {
                    setTabViewIndex(2);
                    setKeyword("");
                  }}
                >
                  {tabViewIndex === 2 ? (
                    <BldText16>계정</BldText16>
                  ) : (
                    <RegText16 style={{ color: theme.tabBarGrey }}>
                      계정
                    </RegText16>
                  )}
                </TopTab>
              </TabBar>
              <TabBarBottomBorder />
            </>
          ) : null}
          <HeaderEntryContainer
            style={
              searchBarFocused && !splaceSearched
                ? {
                    marginTop: pixelScaler(15),
                  }
                : {
                    marginTop: pixelScaler(5),
                  }
            }
          >
            {searchBarFocused || (!searchBarFocused && splaceSearched) ? (
              <TouchableOpacity
                hitSlop={{
                  top: pixelScaler(10),
                  bottom: pixelScaler(10),
                  left: pixelScaler(10),
                  right: pixelScaler(10),
                }}
                onPress={() => {
                  if (searchBarFocused) {
                    setSearchBarFocused(false);
                    setSplaceSearched(false);
                    entryRef.current?.clear();
                    entryRef.current?.blur();
                    Keyboard.dismiss();
                  } else {
                    Keyboard.dismiss();
                    setSearchBarFocused(true);
                    setSplaceSearched(false);
                  }
                }}
              >
                <Icon
                  name="header_back"
                  style={{
                    width: pixelScaler(9),
                    height: pixelScaler(17),
                    marginRight: pixelScaler(21),
                  }}
                />
              </TouchableOpacity>
            ) : null}
            <SearchBar>
              <Icon
                name="search_grey"
                style={{
                  width: pixelScaler(20),
                  height: pixelScaler(20),
                  marginLeft: pixelScaler(15),
                }}
              />
              <RegTextInput16
                ref={entryRef}
                selectionColor={theme.entrySelection}
                style={{
                  flex: 1,
                  marginLeft: pixelScaler(10),
                  marginTop: pixelScaler(1.3),
                }}
                onFocus={() => {
                  setSearchBarFocused(true);
                  setSplaceSearched(false);
                }}
                placeholder={"Find your special place!"}
                placeholderTextColor={theme.searchBarPlaceholder}
                // onChangeText={(text) => {
                //   setKeyword(text);
                // }}
                onChangeText={(text) => {
                  if (tabViewIndex !== 0) {
                    setKeyword(text.trim());
                  }
                }}
                returnKeyType={"done"}
                autoCapitalize={"none"}
                onSubmitEditing={({ nativeEvent: { text } }) => {
                  if (tabViewIndex === 0) {
                    if (text.trim() !== "") {
                      searchSplaceByKeyword(text.trim());
                      setKeyword(text.trim());
                    }
                  } else {
                    Keyboard.dismiss();
                  }
                }}
              />
              {(searchBarFocused || splaceSearched) && tabViewIndex === 0 ? (
                <TouchableOpacity onPress={() => navigation.push("Filter")}>
                  <Icon
                    name={filterActivated ? "filter_activated" : "filter"}
                    style={{
                      width: pixelScaler(17),
                      height: pixelScaler(16.2),
                      marginRight: pixelScaler(16),
                    }}
                  />
                </TouchableOpacity>
              ) : null}
            </SearchBar>
          </HeaderEntryContainer>
        </HeaderContainer>
      ),
      headerStyle: {
        height: pixelScaler(searchBarFocused && !splaceSearched ? 145 : 95),
        shadowColor: "transparent",
      },
    });
  }, [
    keyword,
    tabViewIndex,
    searchBarFocused,
    splaceSearched,
    filterActivated,
  ]);

  const {
    loading,
    refetch: refetchSplaces,
    fetchMore: fetchMoreSplaces,
  } = useQuery(SEARCH_SPLACE, {
    onCompleted,
    variables: {
      type: "splace",
      keyword: "!@#$",
    },
  });

  useEffect(() => {
    if (splaceSearched && splaceSearchType === "splace") {
      (async () => {
        if (!modalKeepVisible) {
          const res = await refetchSplaces({ ...searchVars });
          spinner.stop();
          if (res?.data?.searchSplaces?.ok) {
            if (splaceSearchType === "splace") {
              setSearchedSplaces(res.data.searchSplaces.searchedSplaces ?? []);
              setSplaceSearched(true);
              setSearchBarFocused(false);
            } else {
              setSearchedLogs(res.data.searchSplaces.searchedSplaces ?? []);
              setSplaceSearched(true);
              setSearchBarFocused(false);
            }
          }
        }
      })();
    }
  }, [modalKeepVisible]);

  const searchSplaceByKeyword = async (keyword: string) => {
    try {
      if (!loading && keyword !== "") {
        const variables = {
          type: splaceSearchType,
          keyword,
          ...(filterActivated
            ? {
                ...(filter.bigCategoryIds.length
                  ? { bigCategoryIds: filter.bigCategoryIds }
                  : {}),
                ...(filter.ratingtagIds.length
                  ? { ratingtagIds: filter.ratingtagIds }
                  : {}),
                exceptNoKids: filter.exceptNoKids,
                pets: filter.pets,
                parking: filter.parking,
                ...(filter.lat && filter.lon
                  ? { lat: filter.lat, lon: filter.lon }
                  : {}),
                ...(filter.distance < 0.2
                  ? { distance: 100 }
                  : filter.distance < 0.4
                  ? { distance: 500 }
                  : filter.distance < 0.6
                  ? { distance: 1000 }
                  : filter.distance < 0.8
                  ? { distance: 3000 }
                  : filter.distance < 1.0
                  ? { distance: 5000 }
                  : filter.distance < 1.2
                  ? { distance: 10000 }
                  : {}),
              }
            : {}),
        };

        setSearchVars(variables);
        spinner.start(false);

        const res = await refetchSplaces({ ...variables });

        spinner.stop();
        if (res?.data?.searchSplaces?.ok) {
          if (splaceSearchType === "splace") {
            setSearchedSplaces(res.data.searchSplaces.searchedSplaces ?? []);
            setSplaceSearched(true);
            setSearchBarFocused(false);
          } else {
            setSearchedLogs(res.data.searchSplaces.searchedSplaces ?? []);
            setSplaceSearched(true);
            setSearchBarFocused(false);
          }
        }
        log_searchCategory({ variables: { keyword } });
        log_searchSplace({ variables: { keyword } });
      }

      let tmp = [...history];
      // console.log("before push tmp:", tmp);
      if (keyword !== "" && keyword.indexOf(",") === -1) {
        const ind = tmp.indexOf(keyword);
        if (ind > -1) {
          tmp.splice(ind, 1);
        }
        tmp = [keyword, ...tmp].slice(0, 10);
        // console.log("after push tmp:", tmp);
        await AsyncStorage.setItem("search_history", tmp.toString());
        setHistory(tmp);
        // console.log("history:", history);
      }
    } catch (e) {
      Alert.alert("검색에 실패했습니다." + e);
    }
  };

  useEffect(() => {
    (async () => {
      searchSplaceByKeyword(keyword);
    })();
  }, [splaceSearchType]);

  const { data: categoryData, refetch: refetchCategory } = useQuery(
    SEARCH_CATEGORY,
    {
      variables: {
        keyword: "!@#$",
      },
    }
  );

  const { data: userData, refetch: refetchUser } = useQuery(SEARCH_USER, {
    variables: {
      keyword: "!@#$",
    },
  });

  useEffect(() => {
    if (tabViewIndex === 0) {
      if (keyword !== "" && keyword.indexOf(",") === -1) {
        searchSplaceByKeyword(keyword);
      }
    } else if (tabViewIndex === 1 && keyword !== "") {
      refetchCategory({ keyword });
    } else if (tabViewIndex === 2 && keyword !== "") {
      refetchUser({ keyword });
    }
  }, [keyword]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        height: pixelScaler(searchBarFocused ? 175 : 95),
        shadowColor: "transparent",
      },
    });
    (async () => {
      const historyData = await AsyncStorage.getItem("search_history");
      if (historyData) {
        setHistory(historyData.split(",").slice(0, 10));
      }
    })();
  }, []);

  return searchBarFocused || splaceSearched ? (
    <ScreenContainer>
      {tabViewIndex === 0 ? (
        splaceSearched ? (
          <>
            <SearchModeSelector>
              <SearchModeButton onPress={() => setSplaceSearchType("splace")}>
                {splaceSearchType === "splace" ? (
                  <BldText16>Splace</BldText16>
                ) : (
                  <RegText16 style={{ color: theme.greyText }}>
                    Splace
                  </RegText16>
                )}
              </SearchModeButton>
              <SearchModeButton onPress={() => setSplaceSearchType("photolog")}>
                {splaceSearchType === "photolog" ? (
                  <BldText16>로그</BldText16>
                ) : (
                  <RegText16 style={{ color: theme.greyText }}>로그</RegText16>
                )}
              </SearchModeButton>
            </SearchModeSelector>
            {splaceSearchType === "splace" ? (
              <>
                {searchedSplaces.length > 0 ? (
                  <FlatList
                    data={searchedSplaces}
                    refreshing={refreshing}
                    onRefresh={refresh}
                    numColumns={2}
                    style={{ marginLeft: pixelScaler(30) }}
                    onEndReachedThreshold={0.5}
                    onEndReached={async () => {
                      // console.log("onendreached");
                      if (Object.keys(searchVars).length > 2) {
                        const res: any = await fetchMoreSplaces({
                          variables: {
                            ...searchVars,
                            lastId: searchedSplaces.length,
                            type: "splace",
                          },
                        });
                        if (res?.data?.searchSplaces?.ok) {
                          setSearchedSplaces([
                            ...searchedSplaces,
                            ...(res.data.searchSplaces.searchedSplaces ?? []),
                          ]);
                          setSplaceSearched(true);
                        }
                      }
                    }}
                    renderItem={({ item: splaceResult }) => (
                      <SplaceItemContainer>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.push("Splace", {
                              splace: {
                                id: splaceResult.id,
                              },
                            })
                          }
                          style={{
                            marginBottom: pixelScaler(14),
                          }}
                        >
                          <Image
                            source={{
                              uri:
                                splaceResult.thumbnail &&
                                splaceResult.thumbnail !== ""
                                  ? splaceResult.thumbnail
                                  : BLANK_IMAGE,
                            }}
                            style={{
                              width: pixelScaler(145),
                              height: pixelScaler(145),
                              borderRadius: pixelScaler(10),
                            }}
                          />
                        </TouchableOpacity>
                        <LabelContainer>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.push("Splace", {
                                splace: {
                                  id: splaceResult.id,
                                },
                              })
                            }
                          >
                            <BldText13
                              style={{
                                width: pixelScaler(130),
                                marginTop: pixelScaler(1),
                              }}
                              numberOfLines={1}
                            >
                              {splaceResult.name}
                            </BldText13>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setSplaceId(splaceResult.id);
                              setModalKeepVisible(true);
                            }}
                            hitSlop={{
                              top: pixelScaler(10),
                              bottom: pixelScaler(10),
                              left: pixelScaler(10),
                              right: pixelScaler(10),
                            }}
                          >
                            <Icon
                              name={
                                splaceResult.isSaved
                                  ? "bookmark_fill"
                                  : "bookmark_thin"
                              }
                              style={{
                                width: pixelScaler(12),
                                height: pixelScaler(18),
                              }}
                            />
                          </TouchableOpacity>
                        </LabelContainer>

                        <TagsContainer>
                          <Tag
                            style={{
                              height: pixelScaler(20),
                            }}
                          >
                            <RegText13>
                              {shortenAddress(splaceResult.address)}
                            </RegText13>
                          </Tag>
                          {splaceResult.bigCategories &&
                          splaceResult.bigCategories.split(" ").length > 1 ? (
                            <Tag
                              style={{
                                height: pixelScaler(20),
                                borderRadius: pixelScaler(20),
                              }}
                            >
                              <RegText13>
                                {splaceResult.bigCategories?.split(" ")[0]}
                              </RegText13>
                            </Tag>
                          ) : null}
                        </TagsContainer>
                      </SplaceItemContainer>
                    )}
                    keyExtractor={(item) => item.id + ""}
                  />
                ) : (
                  <BlankMessageContainer>
                    <RegText16
                      style={{
                        color: theme.greyTextAlone,
                        lineHeight: pixelScaler(23),
                      }}
                    >
                      '{keyword}'와 일치하는
                    </RegText16>
                    <RegText16
                      style={{
                        color: theme.greyTextAlone,
                        lineHeight: pixelScaler(23),
                        marginBottom: pixelScaler(60),
                      }}
                    >
                      검색 결과가 없습니다.
                    </RegText16>
                  </BlankMessageContainer>
                )}
                <ModalKeep
                  modalVisible={modalKeepVisible}
                  setModalVisible={setModalKeepVisible}
                  splaceId={splaceId}
                />
                {splaceSearchType === "splace" ? (
                  <FloatingMapButton onPress={() => setShowMap(true)}>
                    <Icon
                      name="map"
                      style={{
                        width: pixelScaler(20),
                        height: pixelScaler(20),
                      }}
                    />
                  </FloatingMapButton>
                ) : null}
                {searchedSplaces.length > 0 ? (
                  <ModalMapView
                    showMap={showMap}
                    setShowMap={setShowMap}
                    splaces={searchedSplaces.map((searchedSplace) => {
                      const coords = searchedSplace.location.split(", ");
                      const bigCategoryIds = searchedSplace.stringBC
                        ?.split(" ")
                        .filter((id) => id !== "");
                      const bigCategoryNames = searchedSplace.bigCategories
                        ?.split(" ")
                        .filter((id) => id !== "");
                      return {
                        id: searchedSplace.id,
                        lat: Number(coords[0]),
                        lon: Number(coords[1]),
                        name: searchedSplace.name,
                        address: searchedSplace.address,
                        thumbnail: searchedSplace.thumbnail,
                        ...(bigCategoryIds && bigCategoryNames
                          ? {
                              bigCategories: bigCategoryIds.map(
                                (bigCategoryId, index) => {
                                  return {
                                    id: Number(bigCategoryId),
                                    name: bigCategoryNames[index],
                                  };
                                }
                              ),
                            }
                          : {}),
                      };
                    })}
                  />
                ) : null}
              </>
            ) : searchedSplaces.length > 0 ? (
              <FlatList
                data={searchedLogs}
                numColumns={2}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      marginRight: pixelScaler(3),
                      marginBottom: pixelScaler(3),
                    }}
                    onPress={() => navigation.push("Log", { id: item.id })}
                  >
                    <Image
                      source={{ uri: item.thumbnail ?? BLANK_IMAGE }}
                      style={{
                        width: pixelScaler(186),
                        height: pixelScaler(186),
                      }}
                    />
                  </TouchableOpacity>
                )}
                onEndReached={async () => {
                  // console.log("onendreached");
                  if (searchedSplaces.length === 10) {
                    if (Object.keys(searchVars).length > 2) {
                      const res = await fetchMoreSplaces({
                        variables: {
                          ...searchVars,
                          lastId: searchedSplaces.length,
                          type: "photolog",
                        },
                      });
                      if (res?.data?.searchSplaces?.ok) {
                        setSearchedLogs([
                          ...searchedSplaces,
                          ...(res.data.searchSplaces.searchedSplaces ?? []),
                        ]);
                        setSplaceSearched(true);
                      }
                    }
                  }
                }}
                keyExtractor={(item) => item.id + ""}
              />
            ) : (
              <BlankMessageContainer>
                <RegText16
                  style={{
                    color: theme.greyTextAlone,
                    lineHeight: pixelScaler(23),
                  }}
                >
                  '{keyword}'와 일치하는
                </RegText16>
                <RegText16
                  style={{
                    color: theme.greyTextAlone,
                    lineHeight: pixelScaler(23),
                  }}
                >
                  검색 결과가 없습니다.
                </RegText16>
              </BlankMessageContainer>
            )}
          </>
        ) : (
          <FlatList
            data={history}
            // inverted={true}
            showsVerticalScrollIndicator={false}
            style={{
              paddingHorizontal: pixelScaler(30),
              // backgroundColor: "#f0e0d0",
            }}
            ItemSeparatorComponent={() => <Seperator />}
            renderItem={({ item }) => {
              // console.log(item);
              return (
                <ListItemContainer
                  onPress={() => {
                    setKeyword(item);
                    searchSplaceByKeyword(item);
                  }}
                >
                  <RegText16>{item}</RegText16>
                </ListItemContainer>
              );
            }}
            keyExtractor={(item) => item}
          />
        )
      ) : tabViewIndex === 1 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[
            ...(categoryData?.searchCategories?.bigCategories.map(
              (bigCategory: {
                id: number;
                name: string;
                totalPhotologs: number;
              }) => {
                return { ...bigCategory, type: "bigCategory" };
              }
            ) ?? []),
            ...(categoryData?.searchCategories?.categories.map(
              (category: {
                id: number;
                name: string;
                totalPhotologs: number;
              }) => {
                return { ...category, type: "category" };
              }
            ) ?? []),
          ]}
          style={{
            paddingHorizontal: pixelScaler(30),
          }}
          ItemSeparatorComponent={() => <Seperator />}
          keyExtractor={(item, index) => item.id + "" + index}
          renderItem={({
            item,
          }: {
            item: {
              type: "bigCategory" | "category";
              id: number;
              name: string;
              totalPhotologs: number;
            };
          }) => (
            <ListItemContainer
              onPress={() => {
                if (item.type === "bigCategory") {
                  navigation.push("LogsByBigCategory", { bigCategory: item });
                } else {
                  navigation.push("LogsByCategory", { category: item });
                }
              }}
            >
              <Tag
                style={{
                  borderRadius: pixelScaler(25),
                  marginRight: pixelScaler(10),
                }}
              >
                <RegText16>{item.name}</RegText16>
              </Tag>
              <RegText13 style={{ color: theme.greyTextLight }}>
                {convertNumber(item.totalPhotologs) + "개의 게시물"}
              </RegText13>
            </ListItemContainer>
          )}
        />
      ) : (
        <FlatList
          data={userData?.searchUsers?.users}
          style={{
            paddingHorizontal: pixelScaler(30),
          }}
          ItemSeparatorComponent={() => <Seperator />}
          renderItem={({ item }: { item: UserType }) => (
            <ListItemContainer
              onPress={() => navigation.push("Profile", { user: item })}
            >
              <Image
                source={{ uri: item.profileImageUrl ?? BLANK_PROFILE_IMAGE }}
                style={{
                  width: pixelScaler(32),
                  height: pixelScaler(32),
                  borderRadius: pixelScaler(32),
                  marginRight: pixelScaler(10),
                }}
              />
              <View>
                <BldText16 style={{ lineHeight: pixelScaler(17) }}>
                  {item.username}
                </BldText16>
                {item.name ? <RegText13>{item.name}</RegText13> : null}
              </View>
            </ListItemContainer>
          )}
          keyExtractor={(item) => item.id + ""}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  ) : (
    <Preview />
  );
};

export default Search;
