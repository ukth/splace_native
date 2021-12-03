import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  SeriesType,
  SplaceType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { pixelScaler } from "../../utils";
import { theme } from "../../../theme";
import { RegTextInput16 } from "../../components/TextInput";
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  useWindowDimensions,
  View,
} from "react-native";
import { Icons } from "../../icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { CREATE_SERIES, EDIT_SPLACE, GET_USER_SERIES } from "../../queries";
import useMe from "../../hooks/useMe";
import { ProgressContext } from "../../contexts/Progress";
import { UploadContentContext } from "../../contexts/UploadContent";

const Tag = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(10)}px;
  height: ${pixelScaler(25)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(25)}px;
  margin-bottom: ${pixelScaler(15)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const EntryContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${pixelScaler(30)}px;
  padding: 0 ${pixelScaler(30)}px;
  justify-content: space-between;
`;

const AddButton = styled.TouchableOpacity`
  border-radius: ${pixelScaler(10)}px;
  width: ${pixelScaler(65)}px;
  height: ${pixelScaler(35)}px;
  border-width: ${pixelScaler(0.67)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.textHighlight};
  align-items: center;
  justify-content: center;
  margin-left: ${pixelScaler(20)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;
const TextInputContainer = styled.View`
  flex: 1;
  border-bottom-width: ${pixelScaler(0.67)}px;
  border-bottom-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyTextLight};
  justify-content: center;
`;

const CategoriesContainer = styled.View`
  flex-direction: row;
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(15)}px;
  flex-wrap: wrap;
`;

const TagContainer = styled.View`
  flex-direction: row;
`;

const SelectSeries = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  // const { splace }: { splace: SplaceType } =
  //   useRoute<RouteProp<StackGeneratorParamList, "SelectSeries">>().params;
  const { content, setContent } = useContext(UploadContentContext);
  const [selectedSeries, setSelectedSeries] = useState(content?.series ?? []);
  const [title, setTitle] = useState("");

  const theme = useContext<ThemeType>(ThemeContext);
  const me = useMe();
  const { spinner } = useContext(ProgressContext);

  const { data, refetch, fetchMore } = useQuery(GET_USER_SERIES, {
    variables: { userId: me.id },
  });

  navigation.addListener("focus", () => refetch());

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.createSeries?.ok) {
      refetch();
    } else {
      Alert.alert("시리즈를 생성할 수 없습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(CREATE_SERIES, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>시리즈 선택</BldText16>,
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightConfirm
          onPress={() => {
            setContent({
              ...content,
              series: selectedSeries,
            });
            navigation.pop();
          }}
        />
      ),
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.pop();
          }}
        />
      ),
    });
  }, [selectedSeries]);

  return (
    <ScreenContainer style={{ paddingTop: pixelScaler(30) }}>
      <EntryContainer>
        <TextInputContainer>
          <RegTextInput16
            placeholder="새 시리즈 입력"
            placeholderTextColor={theme.greyTextLight}
            selectionColor={theme.chatSelection}
            value={title}
            onChangeText={(text) => {
              setTitle(text);
            }}
            onBlur={Keyboard.dismiss}
            onSubmitEditing={Keyboard.dismiss}
          />
        </TextInputContainer>
        <AddButton
          onPress={() => {
            if (title !== "") {
              spinner.start();
              mutation({
                variables: {
                  title: title.trim(),
                  isPrivate: false,
                  photologIds: [],
                },
              });
              setTitle("");
            }
          }}
        >
          <RegText16 style={{ color: theme.textHighlight }}>생성</RegText16>
        </AddButton>
      </EntryContainer>
      <FlatList
        style={{ marginLeft: pixelScaler(30) }}
        data={data?.getUserSeries?.series}
        renderItem={({ item }: { item: SeriesType }) => (
          <TagContainer>
            <Tag
              style={
                selectedSeries.map((series) => series.id).includes(item.id)
                  ? { backgroundColor: theme.themeBackground }
                  : { borderWidth: pixelScaler(0.67) }
              }
              onPress={() => {
                const tmp = [...selectedSeries];
                const idx = tmp.map((series) => series.id).indexOf(item.id);
                if (idx !== -1) {
                  tmp.splice(idx, 1);
                  setSelectedSeries(tmp);
                } else {
                  setSelectedSeries([...tmp, item]);
                }
              }}
            >
              <RegText16
                style={
                  selectedSeries.map((series) => series.id).includes(item.id)
                    ? { color: theme.white }
                    : {}
                }
              >
                {item.title}
              </RegText16>
            </Tag>
          </TagContainer>
        )}
        onEndReached={() => {
          if (data?.getUserSeries?.series?.length) {
            fetchMore({
              variables: {
                lastId:
                  data?.getUserSeries?.series[
                    data?.getUserSeries?.series.length - 1
                  ].id,
                userId: me.id,
              },
            });
          }
        }}
        keyExtractor={(item) => item.id + ""}
      />
    </ScreenContainer>
  );
};

export default SelectSeries;
