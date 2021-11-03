import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";
import HeaderEntry from "./HeaderEntry";



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
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    
  );
};

export default SearchHeader;
