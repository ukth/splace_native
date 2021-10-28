import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import Image from "../../components/Image";
import { pixelScaler, uploadPhotos } from "../../utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { Alert, SafeAreaView, Switch, Image as LocalImage } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import {
  EDIT_SPLACE,
  EDIT_SPLACE_TIMESETS,
  GET_SPLACE_INFO,
} from "../../queries";
import BottomSheetModal from "../../components/BottomSheetModal";
import { ProgressContext } from "../../contexts/Progress";
import { API_URL, tokenVar } from "../../apollo";
import axios from "axios";

const Container = styled.ScrollView``;

const ThumbnailContainer = styled.View`
  width: 100%;
  height: ${pixelScaler(125)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.imageBackground};
  margin-bottom: ${pixelScaler(30)}px;
`;

const ThumbnailCameraButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(0)}px;
  bottom: ${pixelScaler(0)}px;
`;

const LabelButtonsContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
`;

const Seperator = styled.View`
  height: ${pixelScaler(0.7)}px;
  width: ${pixelScaler(315)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.text};
`;

const LabelButton = styled.TouchableOpacity`
  height: ${pixelScaler(45)}px;
  width: ${pixelScaler(315)}px;
  flex-direction: row;
  align-items: center;
`;

const ToggleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${pixelScaler(315)}px;
  margin-bottom: ${pixelScaler(15)}px;
`;

const ToggleConfirmButton = styled.TouchableOpacity`
  margin-top: ${pixelScaler(8)}px;
  height: ${pixelScaler(35)}px;
  border-width: ${pixelScaler(1)}px;
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.borderHighlight};
  align-items: center;
  justify-content: center;
  width: ${pixelScaler(315)}px;
`;

const InfoTextContainer = styled.View`
  margin-top: ${pixelScaler(100)}px;
  align-items: center;
`;

const SuggestInfo = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const [splace, setSplace] = useState(
    useRoute<RouteProp<StackGeneratorParamList, "SuggestInfo">>().params.splace
  );
  const theme = useContext<ThemeType>(ThemeContext);

  const [localUri, setLocalUri] = useState<string>("");

  const { refetch } = useQuery(GET_SPLACE_INFO, {
    variables: { splaceId: splace.id },
  });

  const [modalVisible, setModalVisible] = useState(false);

  const [pets, setPets] = useState(splace.pets);
  const [noKids, setNoKids] = useState(splace.noKids);
  const [parking, setParking] = useState(splace.parking);

  const { spinner } = useContext(ProgressContext);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editSplaces?.ok) {
      Alert.alert("변경이 완료되었습니다.");
    } else {
      Alert.alert("정보를 변경할 수 없습니다.");
      console.log(data);
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  navigation.addListener("focus", async () => {
    const refetched = await refetch();
    if (refetched?.data?.seeSplace?.ok) {
      setSplace(refetched.data?.seeSplace.splace);
    }
  });

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("편집을 위해선 카메라 권한이 필요합니다.");
        navigation.pop();
      }
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>정보 수정 제안</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            if (localUri !== "") {
              spinner.start();
              const awsUrl = (await uploadPhotos([localUri]))[0];
              console.log("@!#", awsUrl);
              if (awsUrl) {
                mutation({
                  variables: {
                    splaceId: splace.id,
                    thumbnail: awsUrl,
                  },
                });
              }
            }
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [localUri]);

  return (
    <ScreenContainer>
      <Container>
        <ThumbnailContainer>
          {localUri !== "" ? (
            <LocalImage
              source={{
                uri: localUri,
              }}
              style={{
                width: "100%",
                height: pixelScaler(125),
              }}
            />
          ) : (
            <Image
              source={{
                uri: splace.thumbnail ?? "",
              }}
              style={{
                width: "100%",
                height: pixelScaler(125),
              }}
            />
          )}
          <ThumbnailCameraButton
            onPress={() => {
              (async () => {
                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.All,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 1,
                });

                if (!result.cancelled) {
                  setLocalUri(result.uri);
                }
              })();
            }}
          >
            <Ionicons name="camera" size={30} color="white" />
          </ThumbnailCameraButton>
        </ThumbnailContainer>
        <LabelButtonsContainer>
          <Seperator style={{ backgroundColor: theme.text }} />
          <LabelButton
            onPress={() =>
              navigation.push("EditSplaceOperatingtime", { splace })
            }
          >
            <RegText16>운영시간</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Ionicons
              style={{ position: "absolute", right: 0 }}
              name="chevron-forward"
              size={30}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceItem", { splace })}
          >
            <RegText16>상품</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Ionicons
              style={{ position: "absolute", right: 0 }}
              name="chevron-forward"
              size={30}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton onPress={() => setModalVisible(true)}>
            <RegText16>체크리스트</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Ionicons
              style={{ position: "absolute", right: 0 }}
              name="chevron-forward"
              size={30}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceCategory", { splace })}
          >
            <RegText16>카테고리</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Ionicons
              style={{ position: "absolute", right: 0 }}
              name="chevron-forward"
              size={30}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.text }} />
        </LabelButtonsContainer>
        <InfoTextContainer>
          <RegText13
            style={{
              lineHeight: pixelScaler(20),
              color: theme.greyTextLight,
              textAlign: "center",
              width: pixelScaler(315),
            }}
          >
            {`에디터이신가요?\n에디터분들이 제안한 정보는 별도의 검토 과정 없이\n바로 반영되며, 악의적인 목적으로 정보를 등록, 삭제할 경우\n서비스 방침에 따라 활동이 제한될 수 있습니다.`}
          </RegText13>
        </InfoTextContainer>
      </Container>
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        <ToggleContainer>
          <RegText16>반려동물 출입 가능</RegText16>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={pets}
            onValueChange={(value) => {
              setPets(value);
            }}
          />
        </ToggleContainer>
        <ToggleContainer>
          <RegText16>No kids zone</RegText16>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={noKids}
            onValueChange={(value) => {
              setNoKids(value);
            }}
          />
        </ToggleContainer>
        <ToggleContainer>
          <RegText16>주차가능</RegText16>
          <Switch
            trackColor={{
              false: theme.switchTrackFalse,
              true: theme.themeBackground,
            }}
            style={{ marginLeft: pixelScaler(15) }}
            value={parking}
            onValueChange={(value) => {
              setParking(value);
            }}
          />
        </ToggleContainer>
        <ToggleConfirmButton
          onPress={() => {
            spinner.start();
            mutation({
              variables: {
                pets,
                noKids,
                parking,
                splaceId: splace.id,
              },
            });
          }}
        >
          <RegText16 style={{ color: theme.textHighlight }}>완료</RegText16>
        </ToggleConfirmButton>
      </BottomSheetModal>
    </ScreenContainer>
  );
};

export default SuggestInfo;
