import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { PhotologType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText13 } from "../Text";
import Tags from "./Tags";

const Content = ({ item }: { item: PhotologType }) => {
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const text = item.text;
  const theme = useContext(ThemeContext);

  useEffect(() => {
    // console.log("content rendered!", item);
  }, []);

  // useEffect(() => {
  //   console.log("content!", item);
  // }, []);

  const ContentContainer = styled.View`
    padding: 0 8%;
  `;
  let ellipsizedText = "";

  let ind = text.indexOf("\n");
  if (ind > 45 || ind === -1) {
    ellipsizedText = text.substring(0, 45);
  } else if (ind < 23) {
    let ind_2 = text.indexOf("\n", ind + 1);
    if (ind_2 - ind > 21) {
      ellipsizedText = text.substring(0, ind + 21);
    } else {
      ellipsizedText = text.substring(0, ind_2);
    }
  } else {
    ellipsizedText = text.substring(0, ind);
  }

  const shortText = text === ellipsizedText;

  return (
    <ContentContainer>
      <RegText13
        style={{
          lineHeight: pixelScaler(17),
          marginBottom: shortText || showFullText ? pixelScaler(17) : 0,
        }}
      >
        {showFullText ? text : ellipsizedText}
        {!shortText && !showFullText ? (
          <RegText13 style={{ lineHeight: pixelScaler(17) }}>...</RegText13>
        ) : null}
        {!shortText && !showFullText ? (
          <RegText13
            style={{
              color: theme.greyText,
              lineHeight: pixelScaler(17),
              textDecorationLine: "underline",
              textDecorationColor: theme.greyText,
              marginBottom: pixelScaler(17),
            }}
            onPress={() => setShowFullText(true)}
          >
            더보기
          </RegText13>
        ) : null}
      </RegText13>
      {shortText || showFullText ? (
        <Tags address={item.splace.address} tags={item.hashtags} />
      ) : null}
    </ContentContainer>
  );
};

export default Content;
