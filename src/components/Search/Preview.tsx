import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { CardBox, RowCardBoxContainer } from "../CardRowBox";
import Tag from "./Tag";

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

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const Preview = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  return (
    <Container showsVerticalScrollIndicator={false}>
      <TagBox>
        <RowTagBox>
          <Tag text="Hot" onPress={() => {}} color={theme.ratingTag} />
          <Tag text="Superhot" onPress={() => {}} color={theme.ratingTag} />
          <Tag text="Tasty" onPress={() => {}} color={theme.ratingTag} />
          <Tag text="Supertasty" onPress={() => {}} color={theme.ratingTag} />
        </RowTagBox>
        <RowTagBox>
          <Tag text="풀파티" onPress={() => {}} />
          <Tag text="포토스팟" onPress={() => {}} />
          <Tag text="산책코스" onPress={() => {}} />
          <Tag text="가을" onPress={() => {}} />
        </RowTagBox>
        <RowTagBox>
          <Tag text="피서" onPress={() => {}} />
          <Tag text="해수욕장" onPress={() => {}} />
          <Tag text="웨이크보드" onPress={() => {}} />
          <Tag text="여름" onPress={() => {}} />
        </RowTagBox>
        <RowTagBox>
          <Tag text="물놀이" onPress={() => {}} />
          <Tag text="워터파크" onPress={() => {}} />
          <Tag text="수상레저" onPress={() => {}} />
          <Tag text="펜션" onPress={() => {}} />
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

export default Preview;
