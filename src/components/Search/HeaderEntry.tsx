import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Keyboard } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";
import { BldTextInput16 } from "../TextInput";



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
    
  );
};

export default HeaderEntry;
