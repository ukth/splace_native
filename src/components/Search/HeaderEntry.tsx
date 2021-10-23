import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";
import { BldTextInput16 } from "../TextInput";

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
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.searchBarBackground};
`;

const HeaderEntry = ({
  focused,
  setFocused,
  searchByKeyword,
}: {
  focused: boolean;
  setFocused: Function;
  searchByKeyword: (_: string) => void;
}) => {
  const theme = useContext<ThemeType>(ThemeContext);
  const textInputRef = useRef<any>();
  const [keyword, setKeyword] = useState<string>("");

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
          value={keyword}
          selectionColor={theme.searchBarPlaceholder}
          style={{
            flex: 1,
            marginLeft: pixelScaler(5),
            color: theme.searchBarPlaceholder,
          }}
          onFocus={() => setFocused(true)}
          placeholder={"Find your special splace!"}
          placeholderTextColor={theme.searchBarPlaceholder}
          onChangeText={(text) => {
            if (text.indexOf(",") === -1) {
              setKeyword(text);
            }
          }}
          returnKeyType={"done"}
          autoCapitalize={"none"}
          onSubmitEditing={() => searchByKeyword(keyword)}
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

export default HeaderEntry;
