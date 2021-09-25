import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled, { ThemeContext } from "styled-components/native";
import { themeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";

const ItemContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 0 ${pixelScaler(30)}px;
  height: ${pixelScaler(60)}px;
`;

const TextContainer = styled.TouchableOpacity`
  flex: 1;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  margin-left: ${pixelScaler(30)}px;
  height: 0.7px;
  background-color: ${({ theme }: { theme: themeType }) =>
    theme.searchHistorySeperator};
`;

const History = ({
  history,
  setHistory,
  searchByKeyword,
}: {
  history: string[];
  setHistory: (_: string[]) => void;
  searchByKeyword: (s: string) => void;
}) => {
  // useEffect(() => {
  //   console.log("in history!", history);
  // }, [history]);
  return (
    <FlatList
      style={{ flex: 1 }}
      data={[...history].reverse()}
      keyExtractor={(item, index) => "" + index}
      renderItem={({ item, index }) => (
        <ItemContainer>
          <TextContainer>
            <RegText16>{item}</RegText16>
          </TextContainer>
          <TouchableOpacity
            onPress={async () => {
              // console.log("#####\n", history);
              // console.log(index);
              const tmp = [...history].reverse();
              // console.log(tmp);
              tmp.splice(index, 1);
              // console.log(tmp);
              await AsyncStorage.setItem(
                "search_history",
                [...tmp].reverse().toString()
              );
              setHistory([...tmp].reverse());
            }}
          >
            <Ionicons name="close" size={20} />
          </TouchableOpacity>
        </ItemContainer>
      )}
      ItemSeparatorComponent={() => <Seperator />}
    />
  );
};

export default History;
