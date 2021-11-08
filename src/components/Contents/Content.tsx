import React, { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { PhotologType, ThemeType } from "../../types";
import { convertTimeDifference2String, pixelScaler } from "../../utils";
import { RegText13 } from "../Text";
import Tags from "./Tags";

const Content = ({ item }: { item: PhotologType }) => {
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const text = item.text ?? "";
  const theme = useContext<ThemeType>(ThemeContext);

  useEffect(() => {
    // console.log("content rendered!", item);
  }, []);

  // useEffect(() => {
  //   console.log("content!", item);
  // }, []);

  const ContentContainer = styled.View`
    padding: 0 ${pixelScaler(30)}px;
  `;
  let ellipsizedText = "";

  let ind = text.indexOf("\n");
  if (ind > 90 || ind === -1) {
    ellipsizedText = text.substring(0, 90);
  } else if (ind < 40) {
    let ind_2 = text.indexOf("\n", ind + 1);
    if (ind_2 === -1) {
      ellipsizedText = text.substring(0, ind + 60);
    } else if (ind_2 - ind > 40) {
      ellipsizedText = text.substring(0, ind_2 + 20);
    } else {
      ellipsizedText = text.substring(0, ind_2);
    }
  } else {
    ellipsizedText = text.substring(0, ind);
  }

  const shortText = text === ellipsizedText;

  const diff = new Date().getTime() - Number(item.createdAt);

  let timeText = convertTimeDifference2String(diff);

  return (
    <ContentContainer>
      {text !== "" ? (
        <RegText13
          style={{
            lineHeight: pixelScaler(17),
            marginBottom: shortText || showFullText ? pixelScaler(13) : 0,
          }}
          onPress={() => {
            if (showFullText) {
              setShowFullText(false);
            }
          }}
        >
          {showFullText ? text : ellipsizedText}
          {!shortText && !showFullText ? (
            <RegText13
              style={{ color: theme.greyText, lineHeight: pixelScaler(17) }}
            >
              {" "}
              ...{" "}
            </RegText13>
          ) : null}
          {!shortText && !showFullText ? (
            <RegText13
              style={{
                color: theme.greyText,
                lineHeight: pixelScaler(17),
                marginBottom: pixelScaler(17),
              }}
              onPress={() => setShowFullText(true)}
            >
              더보기
            </RegText13>
          ) : (
            <RegText13
              style={{
                color: theme.greyTextAlone,
                marginBottom: pixelScaler(10),
              }}
            >
              {"  " + timeText}
            </RegText13>
          )}
        </RegText13>
      ) : (
        <RegText13
          style={{ color: theme.greyTextAlone, marginBottom: pixelScaler(10) }}
        >
          {timeText}
        </RegText13>
      )}
      {shortText || showFullText ? (
        <Tags
          splace={item.splace}
          bigCategories={item.bigCategories ?? []}
          categories={item.categories ?? []}
        />
      ) : null}
    </ContentContainer>
  );
};

export default Content;
