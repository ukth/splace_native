import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { themeType } from "../../types";
import { pixelScaler } from "../../utils";
import ScreenContainer from "../ScreenContainer";
import { RegText16 } from "../Text";
import History from "./History";

const SplaceSearch = ({
  history,
  setHistory,
  searchByKeyword,
}: {
  history: string[];
  setHistory: (_: string[]) => void;
  searchByKeyword: (_: string) => void;
}) => {
  const [showResult, setShowResult] = useState(false);

  return (
    <ScreenContainer>
      {showResult ? (
        <></>
      ) : (
        <History
          history={history}
          setHistory={setHistory}
          searchByKeyword={searchByKeyword}
        />
      )}
    </ScreenContainer>
  );
};

export default SplaceSearch;
