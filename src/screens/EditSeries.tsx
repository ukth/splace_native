import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { PhotologType, StackGeneratorParamList, ThemeType } from "../types";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderBackButton } from "../components/HeaderBackButton";
import { BldText13, BldText16 } from "../components/Text";
import { pixelScaler, showFlashMessage } from "../utils";
import { Alert, FlatList, Switch } from "react-native";
import { BldTextInput16 } from "../components/TextInput";
import { CREATE_SERIES, GET_USER_LOGS } from "../queries";
import useMe from "../hooks/useMe";
import Image from "../components/Image";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "../components/Icon";
import { HeaderRightConfirm } from "../components/HeaderRightConfirm";
import { ProgressContext } from "../contexts/Progress";

const LabelsContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
`;

const LabelContainer = styled.TouchableOpacity`
  flex-direction: row;
  height: ${pixelScaler(60)}px;
  align-items: center;
  justify-content: space-between;
  border-top-width: ${pixelScaler(0.67)}px;
  border-top-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const ThumnailContainer = styled.TouchableOpacity`
  width: ${pixelScaler(186)}px;
  height: ${pixelScaler(186)}px;
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const SelectedBackground = styled.View`
  position: absolute;
  width: ${pixelScaler(186)}px;
  height: ${pixelScaler(186)}px;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 2;
`;

const SelectedNumberIndicator = styled.View`
  position: absolute;
  right: ${pixelScaler(10)}px;
  top: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
  z-index: 3;
  align-items: center;
  justify-content: center;
  width: ${pixelScaler(30)}px;
  height: ${pixelScaler(30)}px;
  border-radius: ${pixelScaler(30)}px;
`;

const EditSeries = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const { series } =
    useRoute<RouteProp<StackGeneratorParamList, "EditSeries">>().params;

  const [isPrivate, setIsPrivate] = useState(false);
  const [title, setTitle] = useState("");
  const me = useMe();
  const [photologIds, setPhotologIds] = useState<number[]>([]);

  const theme = useContext<ThemeType>(ThemeContext);
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
      headerTitle: () => <BldText16>새 시리즈 만들기</BldText16>,
    });
    refetch();
  }, []);

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.createSeries?.ok) {
      showFlashMessage({ message: "시리즈가 생성되었습니다." });
      navigation.pop();
    } else {
      Alert.alert("시리즈를 생성할 수 없습니다.");
    }
  };

  const [mutation, { loading }] = useMutation(CREATE_SERIES, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        title.length ? (
          <HeaderRightConfirm
            onPress={() => {
              if (!loading) {
                spinner.start();
                mutation({
                  variables: {
                    title,
                    isPrivate,
                    photologIds,
                  },
                });
              }
            }}
            text="업로드"
          />
        ) : null,
    });
  }, [title, isPrivate, photologIds]);

  const { data, refetch, fetchMore } = useQuery(GET_USER_LOGS, {
    variables: { userId: me.id },
  });

  useEffect(() => {
    console.log(photologIds);
  }, [photologIds]);

  return (
    <ScreenContainer>
      <LabelsContainer>
        <LabelContainer>
          <BldText16>나만 보기</BldText16>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={isPrivate}
            onValueChange={(value) => setIsPrivate(value)}
          />
        </LabelContainer>
        <LabelContainer>
          <BldTextInput16
            placeholder="게시물 제목"
            selectionColor={theme.entrySelection}
            placeholderTextColor={theme.greyTextAlone}
            maxLength={30}
            multiline={true}
            numberOfLines={2}
            autoCorrect={false}
            value={title}
            onChangeText={(text) => setTitle(text.trim())}
          />
        </LabelContainer>
      </LabelsContainer>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data?.getUserLogs?.logs}
        numColumns={2}
        onEndReachedThreshold={1}
        onEndReached={() =>
          fetchMore({
            variables: {
              userId: me.id,
              lastId:
                data?.getUserLogs?.logs[data?.getUserLogs?.logs.length - 1].id,
            },
          })
        }
        renderItem={({ item }: { item: PhotologType }) => (
          <ThumnailContainer
            onPress={() => {
              if (!photologIds.includes(item.id)) {
                setPhotologIds([...photologIds, item.id]);
              } else {
                const idx = photologIds.indexOf(item.id);
                if (idx !== -1) {
                  const tmp = [...photologIds];
                  tmp.splice(idx, 1);
                  // console.log(tmp);
                  setPhotologIds(tmp);
                }
              }
            }}
          >
            <Image
              source={{ uri: item.imageUrls[0] }}
              style={{
                width: pixelScaler(186),
                height: pixelScaler(186),
              }}
            />
            <BldText13
              style={{
                position: "absolute",
                zIndex: 2,
                left: pixelScaler(15),
                top: pixelScaler(15),
                color: theme.white,
              }}
            >
              {item?.splace?.name}
            </BldText13>
            {item.isPrivate ? (
              <Icon
                name="locked"
                style={{
                  position: "absolute",
                  right: pixelScaler(15),
                  top: pixelScaler(12),
                  width: pixelScaler(12),
                  height: pixelScaler(17),
                }}
              />
            ) : null}
            <LinearGradient
              // Background Linear Gradient
              colors={["rgba(0,0,0,0.2)", "transparent"]}
              style={{
                top: 0,
                position: "absolute",
                height: pixelScaler(40),
                width: pixelScaler(186),
                zIndex: 1,
              }}
            />
            {photologIds.includes(item.id) ? (
              <SelectedBackground>
                <SelectedNumberIndicator>
                  <BldText16 style={{ color: theme.white }}>
                    {photologIds.indexOf(item.id) + 1}
                  </BldText16>
                </SelectedNumberIndicator>
              </SelectedBackground>
            ) : null}
          </ThumnailContainer>
        )}
      />
    </ScreenContainer>
  );
};

export default EditSeries;
