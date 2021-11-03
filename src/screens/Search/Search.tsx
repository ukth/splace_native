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
import {
  BLANK_IMAGE,
  convertNumber,
  pixelScaler,
  shortenAddress,
} from "../../utils";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import Preview from "../../components/Search/Preview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useQuery } from "@apollo/client";
import { SEARCH_CATEGORY, SEARCH_SPLACE, SEARCH_USER } from "../../queries";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
} from "../../components/Text";
import { Icon } from "../../components/Icon";
import { BldTextInput16 } from "../../components/TextInput";
import ScreenContainer from "../../components/ScreenContainer";
import { FilterContext } from "../../contexts/Filter";
import { Item } from "../../components/Folder";
import { Ionicons } from "@expo/vector-icons";
import { ProgressContext } from "../../contexts/Progress";
import { ModalKeep } from "../../components/ModalKeep";
// import { TextInput } from "react-native-gesture-handler";

const HeaderContainer = styled.View`
  align-items: center;
`;

const TabBar = styled.View`
  width: 100%;
  height: ${pixelScaler(60)}px;
  padding: 0 ${pixelScaler(35)}px;
  margin-bottom: ${pixelScaler(20)}px;
  flex-direction: row;
  justify-content: space-between;
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
`;

const HeaderEntryContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(40)}px;
`;
const SearchBar = styled.View`
  flex: 1;
  height: ${pixelScaler(40)}px;
  border-radius: ${pixelScaler(10)}px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.searchBarBackground};
`;

const Tag = styled.View`
  height: ${pixelScaler(25)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-width: ${pixelScaler(0.67)}px;
  align-items: center;
  justify-content: center;
`;

const SplaceItemContainer = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(225)}px;
`;

const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${pixelScaler(13)}px;
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
  height: ${pixelScaler(60)}px;
  padding-left: ${pixelScaler(30)}px;
  flex-direction: row;
  align-items: center;
`;

const SearchModeButton = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(3)}px;
  margin-right: ${pixelScaler(10)}px;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
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

  const onCompleted = (data: any) => {
    setSplaceSearched(true);
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
            <TabBar>
              <TopTab
                focused={tabViewIndex === 0}
                onPress={() => {
                  setTabViewIndex(0);
                  setKeyword("");
                  console.log(tabViewIndex);
                }}
              >
                <RegText16
                  style={{
                    color: tabViewIndex === 0 ? theme.text : theme.tabBarGrey,
                  }}
                >
                  장소
                </RegText16>
              </TopTab>
              <TopTab
                focused={tabViewIndex === 1}
                onPress={() => {
                  setTabViewIndex(1);
                  setKeyword("");
                  console.log(tabViewIndex);
                }}
              >
                <RegText16
                  style={{
                    color: tabViewIndex === 1 ? theme.text : theme.tabBarGrey,
                  }}
                >
                  태그
                </RegText16>
              </TopTab>
              <TopTab
                focused={tabViewIndex === 2}
                onPress={() => {
                  setTabViewIndex(2);
                  setKeyword("");
                  // console.log(tabViewIndex);
                }}
              >
                <RegText16
                  style={{
                    color: tabViewIndex === 2 ? theme.text : theme.tabBarGrey,
                  }}
                >
                  계정
                </RegText16>
              </TopTab>
            </TabBar>
          ) : null}
          <HeaderEntryContainer>
            {searchBarFocused && !splaceSearched ? (
              <TouchableOpacity
                // style={{ backgroundColor: "#2030a0" }}
                onPress={() => {
                  Keyboard.dismiss();
                  setSearchBarFocused(false);
                }}
              >
                <Ionicons name="chevron-back" size={pixelScaler(27)} />
              </TouchableOpacity>
            ) : null}
            <SearchBar>
              <Icon
                name="search_grey"
                style={{
                  width: pixelScaler(20),
                  height: pixelScaler(20),
                  marginLeft: pixelScaler(11),
                  marginRight: pixelScaler(2),
                }}
              />
              <BldTextInput16
                // value={keyword}
                selectionColor={theme.searchBarPlaceholder}
                style={{
                  flex: 1,
                  marginLeft: pixelScaler(5),
                }}
                onFocus={() => {
                  setSearchBarFocused(true);
                  setSplaceSearched(false);
                }}
                placeholder={"Find your special splace!"}
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
              <TouchableOpacity onPress={() => navigation.push("Filter")}>
                <Icon
                  name="filter"
                  style={{
                    width: pixelScaler(17),
                    height: pixelScaler(16.2),
                    marginRight: pixelScaler(16),
                  }}
                />
              </TouchableOpacity>
            </SearchBar>
          </HeaderEntryContainer>
        </HeaderContainer>
      ),
      headerStyle: {
        height: pixelScaler(searchBarFocused && !splaceSearched ? 175 : 95),
      },
    });
  }, [keyword, tabViewIndex, searchBarFocused, splaceSearched]);

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

  const searchSplaceByKeyword = async (keyword: string) => {
    try {
      if (!loading) {
        const variables = {
          type: splaceSearchType,
          keyword,
          ...(filterActivated
            ? {}
            : {
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
              }),
        };
        // console.log(variables);
        setSearchVars(variables);
        spinner.start(false);
        const res = await refetchSplaces({ ...variables });
        spinner.stop();
        if (res?.data?.searchSplaces?.ok) {
          if (splaceSearchType === "splace") {
            setSearchedSplaces(res.data.searchSplaces.searchedSplaces ?? []);
            setSplaceSearched(true);
          } else {
            setSearchedLogs(res.data.searchSplaces.searchedSplaces ?? []);
            setSplaceSearched(true);
          }
        }
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
      console.log("refetch category");
      refetchCategory({ keyword });
    } else if (tabViewIndex === 2 && keyword !== "") {
      console.log("refetch user", keyword);
      refetchUser({ keyword });
    }
  }, [keyword]);

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        height: pixelScaler(searchBarFocused ? 175 : 95),
        borderBottomWidth: 0.2,
      },
    });
    (async () => {
      const historyData = await AsyncStorage.getItem("search_history");
      if (historyData) {
        setHistory(historyData.split(",").slice(0, 10));
        // console.log(historyData);
      }
    })();
    // setHistory([]);
    // AsyncStorage.setItem("search_history", "");
  }, []);

  useEffect(() => {
    console.log(categoryData?.searchCategories?.categories);
  }, [categoryData]);

  return searchBarFocused ? (
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
                      const res = await fetchMoreSplaces({
                        variables: {
                          ...searchVars,
                          lastId: searchedSplaces.length,
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
                      >
                        <Image
                          source={{
                            uri: splaceResult.thumbnail ?? BLANK_IMAGE,
                          }}
                          style={{
                            width: pixelScaler(145),
                            height: pixelScaler(145),
                            borderRadius: pixelScaler(10),
                            marginBottom: pixelScaler(12),
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
                            style={{ width: pixelScaler(130) }}
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
                                : "bookmark_black"
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
                        {splaceResult.stringBC !== "" &&
                        splaceResult.stringBC?.split(" ").length ? (
                          <Tag
                            style={{
                              height: pixelScaler(20),
                            }}
                          >
                            <RegText13>
                              {splaceResult.stringBC?.split(" ")[0]}
                            </RegText13>
                          </Tag>
                        ) : null}
                      </TagsContainer>
                    </SplaceItemContainer>
                  )}
                  keyExtractor={(item) => item.id + ""}
                />
                <ModalKeep
                  modalVisible={modalKeepVisible}
                  setModalVisible={setModalKeepVisible}
                  splaceId={splaceId}
                />
              </>
            ) : (
              <FlatList
                data={searchedLogs}
                numColumns={2}
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
                  if (Object.keys(searchVars).length > 2) {
                    const res = await fetchMoreSplaces({
                      variables: {
                        ...searchVars,
                        lastId: searchedSplaces.length,
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
                }}
                keyExtractor={(item) => item.id + ""}
              />
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
                source={{ uri: item.profileImageUrl ?? BLANK_IMAGE }}
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
        />
      )}
    </ScreenContainer>
  ) : (
    <Preview />
  );
};

export default Search;
