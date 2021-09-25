import React, { useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  useWindowDimensions,
  View,
  TextInput,
  Keyboard,
  Image,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HashTagType, StackGeneratorParamList, themeType } from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { pixelScaler } from "../utils";
import { useContext } from "react";
import {
  BldText16,
  BldText33,
  RegText13,
  RegText16,
  RegText33,
} from "../components/Text";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16, BldTextInput20 } from "../components/TextInput";
import { CardBox, RowCardBoxContainer } from "../components/CardRowBox";
import Tag from "../components/Search/Tag";
import Preview from "../components/Search/Preview";
import SearchHeader from "../components/Search/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenContainer from "../components/ScreenContainer";
import History from "../components/Search/History";
import SplaceSearch from "../components/Search/SplaceSearch";
// import { TextInput } from "react-native-gesture-handler";

const SearchTabMapScreen = () => {
  const theme = useContext<themeType>(ThemeContext);
  const { width } = useWindowDimensions();
  const Container = styled.ScrollView`
    width: ${width}px;
  `;
  const RatingTagsContainer = styled.View`
    height: ${pixelScaler(60)}px;
    padding: 0 ${pixelScaler(30)}px;
    flex-direction: row;
    align-items: center;
  `;

  const SearchResult = ({
    splace,
  }: {
    splace: { name: string; address: string; geolat: number; geolog: number };
  }) => {
    const Container = styled.View`
      flex-direction: row;
      height: ${pixelScaler(75)}px;
      margin-left: ${pixelScaler(30)}px;
      margin-right: ${pixelScaler(30)}px;
      border-top-width: ${pixelScaler(0.5)}px;
      border-top-color: ${theme.searchedItemBorder};
      align-items: center;
    `;

    const TextsContainer = styled.View`
      flex: 1;
      flex-direction: row;
      justify-content: space-between;
    `;

    return (
      <Container>
        <Ionicons
          style={{ marginLeft: 5, marginRight: 10 }}
          size={pixelScaler(35)}
          name={"location-outline"}
        />
        <TextsContainer>
          <View>
            <BldText16>{splace.name}</BldText16>
            <RegText13>{splace.address}</RegText13>
          </View>
          <RegText13 style={{ position: "absolute", right: 0, bottom: 0 }}>
            80m
          </RegText13>
        </TextsContainer>
      </Container>
    );
  };

  return (
    <Container alwaysBounceVertical={true} showsVerticalScrollIndicator={false}>
      <RatingTagsContainer>
        {/* <RatingRag text={"Hot"} onPress={() => {}} />
        <RatingRag text={"Superhot"} onPress={() => {}} />
        <RatingRag text={"Tasty"} onPress={() => {}} />
        <RatingRag text={"Supertasty"} onPress={() => {}} /> */}
      </RatingTagsContainer>
      {[].map((splace, index) => (
        <SearchResult key={index} splace={splace} />
      ))}
    </Container>
  );
};
const SearchTabAccountScreen = () => {
  const { width } = useWindowDimensions();
  const theme = useContext<themeType>(ThemeContext);
  const Container = styled.ScrollView`
    width: ${width}px;
  `;
  const Profile = ({
    profile,
  }: {
    profile: {
      userId: number;
      username: string;
      name: string;
      profileImageUrl: string;
    };
  }) => {
    const ProfileContainer = styled.View`
      flex-direction: row;
      align-items: center;
      height: ${pixelScaler(60)}px;
      padding-left: ${pixelScaler(1)}px;
      margin-left: ${pixelScaler(30)}px;
      margin-right: ${pixelScaler(30)}px;
      border-bottom-width: ${pixelScaler(0.5)}px;
      border-bottom-color: ${theme.searchedItemBorder};
    `;
    const ProfileTextContainer = styled.View`
      margin-left: ${pixelScaler(15)}px;
    `;
    return (
      <ProfileContainer>
        <Image
          style={{
            width: pixelScaler(32),
            height: pixelScaler(32),
            borderRadius: pixelScaler(16),
          }}
          source={{ uri: profile.profileImageUrl }}
        />
        <ProfileTextContainer>
          <BldText16>{profile.username}</BldText16>
          <RegText13 style={{ color: theme.tabBarGrey }}>
            {profile.name}
          </RegText13>
        </ProfileTextContainer>
      </ProfileContainer>
    );
  };

  return (
    <Container alwaysBounceVertical={true}>
      {[].map((profile, index) => (
        <Profile key={index} profile={profile} />
      ))}
    </Container>
  );
};

const TabView = styled.ScrollView`
  flex: 1;
  z-index: 3;
`;

const SearchTabView = ({
  tabViewIndex,
  history,
  searchByKeyword,
  setHistory,
}: {
  tabViewIndex: number;
  history: string[];
  searchByKeyword: (_: string) => void;
  setHistory: (_: string[]) => void;
}) => {
  const theme = useContext<themeType>(ThemeContext);

  return (
    <ScreenContainer>
      {tabViewIndex === 0 ? (
        <SplaceSearch
          history={history}
          setHistory={setHistory}
          searchByKeyword={searchByKeyword}
        />
      ) : null}
      {tabViewIndex === 1 ? (
        <SplaceSearch
          history={history}
          setHistory={setHistory}
          searchByKeyword={searchByKeyword}
        />
      ) : null}
      {tabViewIndex === 2 ? (
        <SplaceSearch
          history={history}
          setHistory={setHistory}
          searchByKeyword={searchByKeyword}
        />
      ) : null}
    </ScreenContainer>
  );
};

const Search = () => {
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const theme = useContext<themeType>(ThemeContext);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const [tabViewIndex, setTabViewIndex] = useState(0);

  const [history, setHistory] = useState<string[]>([]);

  const searchByKeyword = async (keyword: string) => {
    try {
      const tmp = [...history];
      console.log("before push tmp:", tmp);
      if (keyword !== "" && keyword.indexOf(",") === -1) {
        const ind = tmp.indexOf(keyword);
        if (ind > -1) {
          tmp.splice(ind, 1);
        }
        tmp.push(keyword);
        console.log("after push tmp:", tmp);
        await AsyncStorage.setItem("search_history", tmp.toString());
        setHistory(tmp);
        // console.log("history:", history);
      }
    } catch (e) {
      Alert.alert("오류" + e);
      console.log(e);
    }
  };

  useEffect(() => {
    (async () => {
      const historyData = await AsyncStorage.getItem("search_history");
      if (historyData) {
        setHistory(historyData.split(","));
      }
    })();
  }, []);

  useEffect(() => {
    console.log("in search", history);
  }, [history]);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchHeader
          searchBarFocused={searchBarFocused}
          tabViewIndex={tabViewIndex}
          setTabViewIndex={setTabViewIndex}
          setSearchBarFocused={setSearchBarFocused}
          searchByKeyword={searchByKeyword}
        />
      ),
      headerStyle: {
        height: pixelScaler(searchBarFocused ? 175 : 95),
        borderBottomWidth: 0.2,
      },
    });
  }, [searchBarFocused, tabViewIndex, history]);

  return searchBarFocused ? (
    <SearchTabView
      tabViewIndex={tabViewIndex}
      history={history}
      setHistory={setHistory}
      searchByKeyword={searchByKeyword}
    />
  ) : (
    <Preview />
  );
};

export default Search;
