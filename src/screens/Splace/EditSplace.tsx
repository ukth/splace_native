import React, { useState, useEffect, useRef, useContext } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import ScreenContainer from "../../components/ScreenContainer";
import { useMutation, useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackGeneratorParamList, ThemeType, TimeSetType } from "../../types";
import styled, { ThemeContext } from "styled-components/native";
import * as ImagePicker from "expo-image-picker";
import Image from "../../components/Image";
import {
  formatOperatingTime,
  pixelScaler,
  showFlashMessage,
  uploadPhotos,
} from "../../utils";
import { Alert, SafeAreaView, Switch, Image as LocalImage } from "react-native";
import { BldText16, RegText13, RegText16 } from "../../components/Text";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { EDIT_SPLACE, GET_SPLACE_INFO, REPORT } from "../../queries";
import BottomSheetModal from "../../components/BottomSheetModal";
import { ProgressContext } from "../../contexts/Progress";
import useMe from "../../hooks/useMe";
import { Icon } from "../../components/Icon";
import { BLANK_IMAGE, dayNameKor, NO_THUMBNAIL } from "../../constants";
import { of } from "zen-observable";

const Container = styled.ScrollView``;

const ThumbnailContainer = styled.View`
  width: 100%;
  height: ${pixelScaler(125)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.imageBackground};
`;

const ThumbnailBackground = styled.View`
  position: absolute;
  width: 100%;
  height: ${pixelScaler(125)}px;
  background-color: rgba(255, 255, 255, 0.5);
`;

const ThumbnailCameraButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(30)}px;
  bottom: ${pixelScaler(15)}px;
`;

const LabelButtonsContainer = styled.View`
  padding: ${pixelScaler(30)}px ${pixelScaler(30)}px;
  padding-bottom: 0;
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
  justify-content: space-between;
`;

const ReportButton = styled.TouchableOpacity`
  width: 100%;
  height: ${pixelScaler(55)}px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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

const EditSplace = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const [splace, setSplace] = useState(
    useRoute<RouteProp<StackGeneratorParamList, "EditSplace">>().params.splace
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
  const me = useMe();

  const day = new Date().getDay();

  const [operatingTime, setOperatingTime] = useState<TimeSetType[]>();

  const { data, refetch: refetchTimeSet } = useQuery(GET_SPLACE_INFO, {
    variables: { splaceId: splace.id },
  });

  const onReportCompleted = (data: any) => {
    spinner.stop();
    if (data.reportResources?.ok) {
      showFlashMessage({ message: "폐업, 휴점 신고가 완료되었습니다." });
    } else if (data.reportResources?.error === "ERROR3P11") {
      Alert.alert("해당 Splace에 이미 접수된 폐업, 휴점 신고가 존재합니다.");
    } else {
      Alert.alert("폐업, 휴점 신고에 실패했습니다.");
    }
  };

  const [reportMutation, { loading: reportMutationLoading }] = useMutation(
    REPORT,
    {
      onCompleted: onReportCompleted,
    }
  );

  useEffect(() => {
    if (!loading && data?.seeSplace?.ok && data.seeSplace.splace.categories) {
      setSplace(data?.seeSplace?.splace);
      if (data?.seeSplace?.splace?.timeSets?.length === 7) {
        let timeSets = data?.seeSplace?.splace?.timeSets
          .slice()
          .sort((a: TimeSetType, b: TimeSetType) => a.day - b.day);
        setOperatingTime(timeSets);
      }
    }
  }, [data]);

  const onCompleted = (data: any) => {
    spinner.stop();
    if (data?.editSplaces?.ok) {
      if (splace.owner?.id === me.id) {
        Alert.alert("정보가 변경되었습니다.");
      } else if (me.authority === "editor") {
        Alert.alert(
          "정보 변경 완료",
          "건강한 커뮤니티 환경을 위해 같은 장소에 대한 정보 변경은 1시간에 한 번만 가능합니다."
        );
      }
      navigation.pop();
    } else {
      Alert.alert("정보 변경에 실패했습니다.");
    }

    setModalVisible(false);
  };

  const [mutation, { loading }] = useMutation(EDIT_SPLACE, { onCompleted });

  navigation.addListener("focus", async () => {
    const refetched = await refetch();
    refetchTimeSet();
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
      headerTitle: () => <BldText16>편집모드</BldText16>,
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            let variables: {
              pets?: boolean;
              noKids?: boolean;
              parking?: boolean;
              splaceId?: number;
              thumbnail?: string;
            } = {};
            if (localUri !== "") {
              const awsUrl = (await uploadPhotos([localUri]))[0];
              if (awsUrl) {
                variables.thumbnail = awsUrl;
              }
            }
            if (splace.noKids !== noKids) {
              variables.noKids = noKids;
            }
            if (splace.parking !== parking) {
              variables.parking = parking;
            }
            if (splace.pets !== pets) {
              variables.pets = pets;
            }

            if (Object.keys(variables).length > 0) {
              spinner.start();
              mutation({
                variables,
              });
            } else {
              navigation.pop();
            }
          }}
        />
      ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [localUri, pets, noKids, parking]);

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
                uri: splace.thumbnail ?? NO_THUMBNAIL,
              }}
              style={{
                width: "100%",
                height: pixelScaler(125),
              }}
            />
          )}
          <ThumbnailBackground />
          <ThumbnailCameraButton
            onPress={() => {
              (async () => {
                let result = await ImagePicker.launchImageLibraryAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  allowsEditing: true,
                  aspect: [1, 1],
                  quality: 0,
                });

                if (!result.cancelled) {
                  setLocalUri(result.uri);
                }
              })();
            }}
          >
            <Icon
              name="gallery_black"
              style={{
                zIndex: 1,
                width: pixelScaler(25),
                height: pixelScaler(20),
              }}
            />
          </ThumbnailCameraButton>
        </ThumbnailContainer>
        <LabelButtonsContainer>
          <Seperator style={{ backgroundColor: theme.text }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceInfo", { splace })}
          >
            <RegText16>
              기본정보
              <RegText16 style={{ color: theme.textHighlight }}>*</RegText16>
            </RegText16>
            <RegText13
              style={{
                color: theme.textHighlight,
                position: "absolute",
                left: pixelScaler(75),
              }}
            >
              {splace.name}
            </RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceLocation", { splace })}
          >
            <RegText16>
              위치정보
              <RegText16 style={{ color: theme.textHighlight }}>*</RegText16>
            </RegText16>
            <RegText13
              style={{
                color: theme.textHighlight,
                position: "absolute",
                left: pixelScaler(75),
              }}
            >
              {splace.address}
            </RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() =>
              navigation.push("EditSplaceOperatingtime", { splace })
            }
          >
            <RegText16>운영시간</RegText16>
            <RegText13
              style={{
                color: theme.textHighlight,
                position: "absolute",
                left: pixelScaler(75),
              }}
            >
              {dayNameKor[day] + " "}
              {operatingTime?.filter((timeset) => timeset.open).length
                ? operatingTime[day].open
                  ? formatOperatingTime(operatingTime[day].open ?? 0) +
                    " - " +
                    formatOperatingTime(operatingTime[day].close ?? 0) +
                    (operatingTime[day].breakOpen &&
                    operatingTime[day].breakClose
                      ? " (Break " +
                        formatOperatingTime(operatingTime[day].breakOpen ?? 0) +
                        " - " +
                        formatOperatingTime(
                          operatingTime[day].breakClose ?? 0
                        ) +
                        ")"
                      : "")
                  : "휴무일"
                : ""}
            </RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceItem", { splace })}
          >
            <RegText16>상품</RegText16>
            <RegText13
              style={{
                color: theme.textHighlight,
                position: "absolute",
                left: pixelScaler(75),
              }}
            >
              {(splace.itemName ?? "") +
                (splace.itemPrice ? " ₩" + splace.itemPrice : "")}
            </RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceIntro", { splace })}
          >
            <RegText16>소개글</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton onPress={() => setModalVisible(true)}>
            <RegText16>체크리스트</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => navigation.push("EditSplaceCategory", { splace })}
          >
            <RegText16>카테고리</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.lightSeperator }} />
          <LabelButton
            onPress={() => {
              navigation.push("FixedContents", { splace });
            }}
          >
            <RegText16>안내 게시물</RegText16>
            <RegText13 style={{ color: theme.text }}></RegText13>
            <Icon
              name="arrow_right"
              style={{
                width: pixelScaler(6),
                height: pixelScaler(12),
              }}
            />
          </LabelButton>
          <Seperator style={{ backgroundColor: theme.text }} />
        </LabelButtonsContainer>
        <ReportButton
          onPress={() =>
            Alert.alert(
              "폐업, 휴점 정보 제안",
              "이 가게의 영업상태가 변경되었나요?",
              [
                {
                  text: "폐업",
                  onPress: () => {
                    if (!reportMutationLoading) {
                      spinner.start();
                      reportMutation({
                        variables: {
                          sourceType: "splace status",
                          sourceId: splace.id,
                          reason: "closure",
                        },
                      });
                    }
                  },
                },
                {
                  text: "휴점",
                  onPress: () => {
                    if (!reportMutationLoading) {
                      spinner.start();
                      reportMutation({
                        variables: {
                          sourceType: "splace status",
                          sourceId: splace.id,
                          reason: "break",
                        },
                      });
                    }
                  },
                },
                {
                  text: "휴점 종료",
                  onPress: () => {
                    if (!reportMutationLoading) {
                      spinner.start();
                      reportMutation({
                        variables: {
                          sourceType: "splace status",
                          sourceId: splace.id,
                          reason: "end break",
                        },
                      });
                    }
                  },
                },
                {
                  text: "취소",
                  onPress: () => {},
                  style: "cancel",
                },
              ]
            )
          }
        >
          <RegText13 style={{ color: theme.errorText }}>
            폐업 및 휴점 신고
          </RegText13>
        </ReportButton>
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
      </BottomSheetModal>
    </ScreenContainer>
  );
};

export default EditSplace;
