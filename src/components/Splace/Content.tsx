import React, { useContext, useEffect, useState } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { FixedContentType, PhotologType } from "../../types";
import { convertTimeDifference2String, pixelScaler } from "../../utils";
import { RegText13 } from "../Text";

const Content = ({ item }: { item: FixedContentType }) => {
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const text = item.text ?? "";
  const theme = useContext(ThemeContext);

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

  const diff = new Date().getTime() - Number(item.createdAt);

  const timeText = convertTimeDifference2String(diff);

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
    </ContentContainer>
  );
};

export default Content;
