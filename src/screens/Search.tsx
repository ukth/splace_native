import React, { useEffect, useState, useRef } from "react";
import {
  TouchableOpacity,
  useWindowDimensions,
  View,
  Animated,
  NativeSyntheticEvent,
  TextInput,
  Keyboard,
  Image,
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
// import { TextInput } from "react-native-gesture-handler";

const SearchTabContentScreen = () => {
  const { width } = useWindowDimensions();
  const Container = styled.ScrollView`
    width: ${width}px;
  `;
  return (
    <Container showsVerticalScrollIndicator={false} alwaysBounceVertical={true}>
      <View style={{ height: 400, width: "100%", alignItems: "center" }}>
        <BldText33>?</BldText33>
      </View>
      <View style={{ height: 400, width: "100%", alignItems: "center" }}>
        <BldText33>?</BldText33>
      </View>
      <View style={{ height: 400, width: "100%", alignItems: "center" }}>
        <BldText33>?</BldText33>
      </View>
    </Container>
  );
};
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

  const RatingRag = ({
    text,
    onPress,
  }: {
    text: string;
    onPress: Function;
  }) => {
    const Container = styled.TouchableOpacity`
      align-items: center;
      justify-content: center;
      height: ${pixelScaler(25)}px;
      border-color: ${theme.ratingTag};
      border-width: ${pixelScaler(0.8)}px;
      border-radius: ${pixelScaler(12.5)}px;
      margin-right: ${pixelScaler(5)}px;
      padding: 0 ${pixelScaler(10)}px;
    `;
    return (
      <Container>
        <RegText16 style={{ color: theme.ratingTag }}>{text}</RegText16>
      </Container>
    );
  };
  const data = [
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
    {
      name: "스타벅스 신용산점",
      address: "서울특별시 용산구 123길 45",
      geolat: 100.3,
      geolog: 35.3,
    },
  ];

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
        <RatingRag text={"Hot"} onPress={() => {}} />
        <RatingRag text={"Superhot"} onPress={() => {}} />
        <RatingRag text={"Tasty"} onPress={() => {}} />
        <RatingRag text={"Supertasty"} onPress={() => {}} />
      </RatingTagsContainer>
      {data.map((splace, index) => (
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

  const data = [
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
    {
      userId: 1,
      username: "dreamost_heo",
      profileImageUrl:
        "https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F202105%2F20210514170055590.jpg",
      name: "허성범",
    },
  ];
  return (
    <Container alwaysBounceVertical={true}>
      {data.map((profile, index) => (
        <Profile key={index} profile={profile} />
      ))}
    </Container>
  );
};

const TabView = styled.ScrollView`
  flex: 1;
  z-index: 3;
`;

const SearchTabView = () => {
  const { width } = useWindowDimensions();
  const tabViewWidth = width - pixelScaler(60);
  const topTabWidth = pixelScaler(65);
  const theme = useContext<themeType>(ThemeContext);

  const Container = styled.View`
    flex: 1;
    background-color: ${theme.background};
    padding: 0 ${pixelScaler(30)}px;
  `;

  const Screen = styled.View`
    flex: 1;
    align-items: center;
    justify-content: center;
    width: ${width}px;
  `;

  const TabBar = styled.View`
    width: 100%;
    height: ${pixelScaler(60)}px;
    padding: 0 ${pixelScaler(30)}px;
    flex-direction: row;
    justify-content: space-between;
  `;

  const TopTab = styled.TouchableOpacity`
    width: ${topTabWidth}px;
    align-items: center;
    justify-content: center;
    background-color: ${theme.background};
  `;
  const BottomBarContainer = styled.View`
    height: ${pixelScaler(1)}px;
    background-color: ${theme.searchedItemBorder};
    margin-left: ${pixelScaler(30)}px;
    margin-right: ${pixelScaler(30)}px;
  `;

  const scrollIndicator = useRef(new Animated.Value(0)).current;

  const [tabViewIndex, setTabViewIndex] = useState(0);

  const scrollIndicatorPosition = Animated.multiply(
    scrollIndicator,
    tabViewWidth / (width * 2)
  ).interpolate({
    inputRange: [0, tabViewWidth],
    outputRange: [0, tabViewWidth - topTabWidth],
    extrapolate: "clamp",
  });

  const scrollRef = useRef<any>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
      }}
    >
      <TabBar>
        <TopTab
          onPress={() => {
            scrollRef.current?.scrollTo({ x: 0 });
          }}
        >
          <RegText16
            style={{
              color: tabViewIndex === 0 ? theme.text : theme.tabBarGrey,
            }}
          >
            게시물
          </RegText16>
        </TopTab>
        <TopTab
          onPress={() => {
            scrollRef.current?.scrollTo({ x: width });
          }}
        >
          <RegText16
            style={{
              color: tabViewIndex === 1 ? theme.text : theme.tabBarGrey,
            }}
          >
            지도
          </RegText16>
        </TopTab>
        <TopTab
          onPress={() => {
            scrollRef.current?.scrollTo({ x: width * 2 });
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
      <BottomBarContainer>
        <Animated.View
          style={{
            width: pixelScaler(65),
            backgroundColor: theme.text,
            height: pixelScaler(1),
            transform: [{ translateX: scrollIndicatorPosition }],
          }}
        />
      </BottomBarContainer>
      <TabView
        ref={scrollRef}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollIndicator } } }],
          {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<any>) => {
              const off_X = event.nativeEvent?.contentOffset?.x ?? 0;
              // console.log(off_X);
              if (off_X < width / 2) {
                setTabViewIndex(0);
              } else if (off_X < (width * 3) / 2) {
                setTabViewIndex(1);
              } else {
                setTabViewIndex(2);
              }
            },
          }
        )}
        scrollEventThrottle={5}
      >
        <SearchTabContentScreen />
        <SearchTabMapScreen />
        <SearchTabAccountScreen />
      </TabView>
    </View>
  );
};

const SearchBarTextInput = ({
  focused,
  setFocused,
}: {
  focused: boolean;
  setFocused: Function;
}) => {
  const theme = useContext<themeType>(ThemeContext);
  const textInputRef = useRef<any>();
  const Container = styled.View`
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
    background-color: ${theme.searchBarBackground};
  `;
  useEffect(() => {
    if (focused) {
      textInputRef.current.focus();
    }
  }, [focused]);
  return (
    <Container>
      <SearchBar>
        <Ionicons
          style={{ marginLeft: pixelScaler(10) }}
          name={"search"}
          size={pixelScaler(22)}
          color={theme.searchBarPlaceholder}
        />
        <BldTextInput16
          ref={textInputRef}
          selectionColor={theme.searchBarPlaceholder}
          style={{
            flex: 1,
            marginLeft: pixelScaler(5),
            color: theme.searchBarPlaceholder,
          }}
          onFocus={() => setFocused(true)}
          placeholder={"Find your special splace!"}
          placeholderTextColor={theme.searchBarPlaceholder}
        />
      </SearchBar>
      {focused ? (
        <TouchableOpacity
          style={{ marginLeft: pixelScaler(10) }}
          onPress={() => {
            setFocused(false);
            Keyboard.dismiss();
          }}
        >
          <RegText16>취소</RegText16>
        </TouchableOpacity>
      ) : null}
    </Container>
  );
};

const Search = () => {
  const [searchBarFocused, setSearchBarFocused] = useState(false);
  const theme = useContext<themeType>(ThemeContext);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <SearchBarTextInput
          focused={searchBarFocused}
          setFocused={setSearchBarFocused}
        />
      ),
      headerStyle: {
        height: pixelScaler(95),
      },
    });
  }, [searchBarFocused]);

  const Container = styled.ScrollView`
    flex: 1;
    background-color: ${theme.background};
  `;

  const Tag = ({ hashTag }: { hashTag: HashTagType }) => {
    const Container = styled.TouchableOpacity`
      height: ${pixelScaler(25)}px;
      padding: 0 10px;
      border-radius: ${pixelScaler(12.5)}px;
      border-width: ${pixelScaler(0.8)}px;
      align-items: center;
      justify-content: center;
      margin-right: ${pixelScaler(10)}px;
    `;
    return (
      <Container>
        <RegText16>{hashTag.name}</RegText16>
      </Container>
    );
  };

  const TagBox = styled.View`
    width: 100%;
    padding: 0 ${pixelScaler(30)}px;
    margin-top: ${pixelScaler(30)}px;
  `;

  const RowTagBox = styled.View`
    width: 100%;
    flex-direction: row;
    margin-bottom: ${pixelScaler(15)}px;
  `;

  const Recommendation = styled.View`
    margin-top: 15px;
  `;

  return searchBarFocused ? (
    <SearchTabView />
  ) : (
    <Container showsVerticalScrollIndicator={false}>
      <TagBox>
        <RowTagBox>
          <Tag hashTag={{ id: 1, name: "풀파티" }} />
          <Tag hashTag={{ id: 1, name: "포토스팟" }} />
          <Tag hashTag={{ id: 1, name: "산책코스" }} />
          <Tag hashTag={{ id: 1, name: "가을" }} />
        </RowTagBox>
        <RowTagBox>
          <Tag hashTag={{ id: 1, name: "피서" }} />
          <Tag hashTag={{ id: 1, name: "해수욕장" }} />
          <Tag hashTag={{ id: 1, name: "웨이크보드" }} />
          <Tag hashTag={{ id: 1, name: "여름" }} />
        </RowTagBox>
        <RowTagBox>
          <Tag hashTag={{ id: 1, name: "물놀이" }} />
          <Tag hashTag={{ id: 1, name: "워터파크" }} />
          <Tag hashTag={{ id: 1, name: "수상레저" }} />
          <Tag hashTag={{ id: 1, name: "펜션" }} />
        </RowTagBox>
      </TagBox>
      <Recommendation>
        <RowCardBoxContainer>
          <CardBox
            url={
              "https://i.pinimg.com/originals/ee/5f/84/ee5f8468c507d77abd010c78c094c14e.jpg"
            }
            onPress={() => {}}
          />
          <CardBox
            url={
              "https://i.insider.com/5dee87fa79d75747e07cf755?width=1000&format=jpeg"
            }
            onPress={() => {}}
          />
        </RowCardBoxContainer>
        <RowCardBoxContainer>
          <CardBox
            url={
              "https://i.pinimg.com/originals/ee/5f/84/ee5f8468c507d77abd010c78c094c14e.jpg"
            }
            onPress={() => {}}
          />
          <CardBox
            url={
              "https://i.insider.com/5dee87fa79d75747e07cf755?width=1000&format=jpeg"
            }
            onPress={() => {}}
          />
        </RowCardBoxContainer>
        <RowCardBoxContainer>
          <CardBox
            url={
              "https://i.pinimg.com/originals/ee/5f/84/ee5f8468c507d77abd010c78c094c14e.jpg"
            }
            onPress={() => {}}
          />
          <CardBox
            url={
              "https://i.insider.com/5dee87fa79d75747e07cf755?width=1000&format=jpeg"
            }
            onPress={() => {}}
          />
        </RowCardBoxContainer>
        <RowCardBoxContainer>
          <CardBox
            url={
              "https://i.pinimg.com/originals/ee/5f/84/ee5f8468c507d77abd010c78c094c14e.jpg"
            }
            onPress={() => {}}
          />
          <CardBox
            url={
              "https://i.insider.com/5dee87fa79d75747e07cf755?width=1000&format=jpeg"
            }
            onPress={() => {}}
          />
        </RowCardBoxContainer>
      </Recommendation>
    </Container>
  );
};

export default Search;
