import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { themeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";
import HeaderEntry from "./HeaderEntry";

const Container = styled.View`
  align-items: center;
`;

const TabBar = styled.View`
  width: 100%;
  height: ${pixelScaler(60)}px;
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(20)}px;
  flex-direction: row;
  justify-content: space-between;
`;

const TopTab = styled.TouchableOpacity`
  width: ${pixelScaler(65)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
  border-bottom-width: ${({
    theme,
    focused,
  }: {
    theme: themeType;
    focused: boolean;
  }) => (focused ? 1 : 0)}px;
`;

const SearchHeader = ({
  searchBarFocused,
  tabViewIndex,
  setTabViewIndex,
  setSearchBarFocused,
  searchByKeyword,
}: {
  searchBarFocused: boolean;
  tabViewIndex: number;
  setTabViewIndex: (_: number) => void;
  setSearchBarFocused: (_: boolean) => void;
  searchByKeyword: (_: string) => void;
}) => {
  const theme = useContext<themeType>(ThemeContext);
  return (
    <Container>
      {searchBarFocused ? (
        <TabBar>
          <TopTab
            focused={tabViewIndex === 0}
            onPress={() => {
              setTabViewIndex(0);
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
              console.log(tabViewIndex);
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
      <HeaderEntry
        focused={searchBarFocused}
        setFocused={setSearchBarFocused}
        searchByKeyword={searchByKeyword}
      />
    </Container>
  );
};

export default SearchHeader;
