import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Image as DefaultImage,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";

import Image from "../../components/Image";
import {
  FolderType,
  SaveType,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { HeaderTitle, StackNavigationProp } from "@react-navigation/stack";
import {
  DeleteButton,
  EditButtonsContainer,
  Item,
  Minus,
  NewFolderButton,
  SortButton,
} from "../../components/Folder";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
  RegText20,
} from "../../components/Text";
import { pixelScaler, shortenAddress, strCmpFunc } from "../../utils";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalButtonBox from "../../components/ModalButtonBox";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import {
  ADD_FOLDER_MEMBERS,
  EDIT_FOLDER,
  GET_FOLDER_INFO,
  LEAVE_FOLDER,
  REMOVE_SAVE,
} from "../../queries";
import { useMutation, useQuery } from "@apollo/client";
import ModalMapView from "../../components/ModalMapView";
import { FloatingMapButton } from "../../components/FloatingMapButton";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { Icon } from "../../components/Icon";
import { NO_THUMBNAIL } from "../../constants";

const SaveItemContainer = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(225)}px;
  align-items: center;
`;

const InfoContainer = styled.View`
  width: ${pixelScaler(145)}px;
  margin-top: ${pixelScaler(15)}px;
`;

const BadgesContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(12)}px;
`;

const AddressBadge = styled.View`
  border-width: ${pixelScaler(0.67)}px;
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(9)}px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin-right: ${pixelScaler(9)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const Category = styled.View`
  border-width: ${pixelScaler(0.67)}px;
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(20)}px;
  justify-content: center;
  padding-top: ${pixelScaler(1.3)}px;
`;

const SaveItem = ({
  save,
  folderId,
  index,
  editing,
  refetch,
}: {
  save: SaveType;
  folderId: number;
  index: number;
  editing: boolean;
  refetch: () => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const onDeleteCompleted = (data: {
    removeSave: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      removeSave: { ok, error },
    } = data;
    if (ok) {
      Alert.alert("삭제되었습니다.", error);
      refetch();
    } else {
      Alert.alert("삭제에 실패했습니다.", error);
    }
  };

  const [deleteMutation, { loading: deleteMutationLoading }] = useMutation(
    REMOVE_SAVE,
    {
      onCompleted: onDeleteCompleted,
    }
  );

  const theme = useContext<ThemeType>(ThemeContext);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push("Splace", {
          splace: save.splace,
        });
      }}
    >
      <SaveItemContainer>
        {editing ? (
          <DeleteButton
            onPress={() => {
              Alert.alert("해당 공간을 삭제하시겠습니까?", "", [
                {
                  text: "취소",
                  style: "cancel",
                },
                {
                  text: "확인",
                  onPress: () => {
                    if (!deleteMutationLoading) {
                      deleteMutation({
                        variables: {
                          saveId: save.id,
                          folderId,
                        },
                      });
                    }
                  },
                },
              ]);
            }}
          >
            <Minus />
          </DeleteButton>
        ) : null}
        <View style={{ marginTop: pixelScaler(15) }}>
          <Image
            source={{
              uri: save.splace.thumbnail?.length
                ? save.splace.thumbnail
                : NO_THUMBNAIL,
            }}
            style={{
              width: pixelScaler(145),
              height: pixelScaler(145),
              borderRadius: pixelScaler(10),
              borderWidth: pixelScaler(0.4),
              borderColor: theme.imageBorder,
            }}
          />
        </View>
        <InfoContainer>
          <BldText13>{save.splace.name}</BldText13>
          <BadgesContainer>
            <AddressBadge>
              <DefaultImage
                source={require("../../../assets/images/icons/positionpin_small.png")}
                style={{
                  width: pixelScaler(8.3),
                  height: pixelScaler(12),
                  marginRight: pixelScaler(6),
                }}
              />
              <RegText13>{shortenAddress(save.splace.address)}</RegText13>
            </AddressBadge>
            {save.splace.bigCategories?.length ? (
              <Category>
                <RegText13>{save.splace.bigCategories[0]?.name}</RegText13>
              </Category>
            ) : null}
          </BadgesContainer>
        </InfoContainer>
      </SaveItemContainer>
    </TouchableWithoutFeedback>
  );
};

// const ListHeader = () =>

const Folder = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Folder">;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<"createdAt" | "name">("createdAt");
  const theme = useContext<ThemeType>(ThemeContext);
  const [folder, setFolder] = useState<FolderType>({
    ...route.params.folder,
    saves: [],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [showMap, setShowMap] = useState(false);
  const [showSortmodeModal, setShowSortmodeModal] = useState(false);

  const [saves, setSaves] = useState<SaveType[]>();

  useEffect(() => {
    if (sortMode === "createdAt") {
      setSaves(
        [...folder.saves].sort(
          (a: SaveType, b: SaveType) =>
            Number(b.createdAt) - Number(a.createdAt)
        )
      );
    } else {
      setSaves(
        [...folder.saves].sort((a: SaveType, b: SaveType) =>
          strCmpFunc(a.splace.name, b.splace.name)
        )
      );
    }
  }, [sortMode, folder]);

  const onEditCompleted = (data: {
    editFolder: {
      ok: boolean;
      error: string;
    };
  }) => {
    const { ok, error } = data.editFolder;
    if (ok) {
      Alert.alert("", "폴더 이름이 변경되었습니다.");
    } else {
      Alert.alert("폴더 이름을 변경할 수 없습니다.", error);
    }
  };

  const [editMutation, { loading: editLoading }] = useMutation(EDIT_FOLDER, {
    onCompleted: onEditCompleted,
  });

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        editing ? (
          <HeaderRightConfirm
            onPress={() => {
              setEditing(false);
            }}
          />
        ) : (
          <HeaderRightMenu
            onPress={() => {
              setModalVisible(true);
            }}
          />
        ),
      headerTitle: () =>
        editing ? (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => {
              Alert.prompt(
                "폴더 이름 변경",
                "새로운 폴더의 이름을 입력하세요",
                (text) => {
                  if (text.trim() !== "") {
                    editMutation({
                      variables: {
                        folderId: folder.id,
                        title: text.trim(),
                      },
                    });
                    setFolder({
                      ...folder,
                      title: text.trim(),
                    });
                  } else {
                    Alert.alert(
                      "폴더 이름에는 한 글자 이상의 문자가 들어가야 합니다."
                    );
                  }
                },
                "plain-text"
              );
            }}
          >
            <BldText16>{folder.title}</BldText16>
            <Icon
              name="edit"
              style={{
                width: pixelScaler(18),
                height: pixelScaler(18),
                marginLeft: pixelScaler(10),
              }}
            />
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row" }}>
            <BldText16>{folder.title}</BldText16>
          </View>
        ),
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });
  }, [editing, folder]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onInviteCompleted = (data: {
    addFolderMembers: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      addFolderMembers: { ok, error },
    } = data;
    if (ok) {
      navigation.pop();
    } else {
      Alert.alert("초대에 실패하였습니다.", error);
    }
  };

  const [inviteMutation, { loading: inviteMutationLoading }] = useMutation(
    ADD_FOLDER_MEMBERS,
    {
      onCompleted: onInviteCompleted,
    }
  );

  const onLeaveCompleted = (data: any) => {
    const {
      quitFolder: { ok, error },
    } = data;
    if (ok) {
      navigation.navigate("Folders");
    } else {
      Alert.alert("폴더를 나갈 수 없습니다.", error);
    }
  };

  const [leaveMutation, { loading: leaveMutationLoading }] = useMutation(
    LEAVE_FOLDER,
    {
      onCompleted: onLeaveCompleted,
    }
  );

  const {
    data: folderInfo,
    loading: folderInfoLoading,
    refetch,
  } = useQuery(GET_FOLDER_INFO, {
    variables: {
      folderId: folder.id,
    },
  });

  navigation.addListener("focus", async () => {
    await refetch();
  });

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    await refetch();
    clearTimeout(timer);
    setRefreshing(false);
  };

  useEffect(() => {
    if (folderInfo?.seeFolder?.ok) {
      setFolder(folderInfo?.seeFolder?.folder);
    }
  }, [folderInfo]);

  // useEffect(() => {
  //   console.log(folder.saves.map((save) => save.splace));
  // }, [folder]);

  return (
    <ScreenContainer>
      <FlatList
        style={{ left: pixelScaler(17.5), width: pixelScaler(340) }}
        refreshing={refreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <EditButtonsContainer>
            <NewFolderButton
              onPress={() => {
                navigation.push("AddSaveFolders", {
                  targetFolderId: folder.id,
                  splaceIds: [],
                });
              }}
            >
              <RegText13>+ 추가하기</RegText13>
            </NewFolderButton>
            {!saves || saves.length > 0 ? (
              <SortButton
                onPress={() => {
                  setShowSortmodeModal(true);
                }}
              >
                <RegText13>
                  {sortMode === "createdAt" ? "최근 생성 순" : "가나다 순"}
                </RegText13>
                <Icon
                  name="arrow_right"
                  style={{
                    width: pixelScaler(5),
                    height: pixelScaler(10.7),
                    transform: [{ rotate: "90deg" }],
                    marginLeft: pixelScaler(6),
                  }}
                />
              </SortButton>
            ) : null}
          </EditButtonsContainer>
        }
        data={saves}
        renderItem={({ item, index }) => (
          <SaveItem
            folderId={folder.id}
            save={item}
            index={index}
            editing={editing}
            refetch={refetch}
          />
        )}
        keyExtractor={(item, index) => "" + index}
        numColumns={2}
      />
      {!saves || saves.length > 0 ? null : (
        <View
          style={{
            flex: 1.3,
            alignItems: "center",
          }}
        >
          <RegText16 style={{ lineHeight: pixelScaler(23) }}>
            해당 폴더는 비어있습니다
          </RegText16>
          <RegText16
            onPress={() => {
              navigation.push("AddSaveFolders", {
                targetFolderId: folder.id,
                splaceIds: [],
              });
            }}
            style={{ color: theme.textHighlight, lineHeight: pixelScaler(23) }}
          >
            장소 추가하기
          </RegText16>
        </View>
      )}
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        <ModalButtonBox
          onPress={() => {
            setModalVisible(false);
            navigation.push("Members", {
              title: folder.title,
              vars: {
                folderId: folder.id,
              },
              membersData: folderInfo?.seeFolder?.folder?.members,
              refetchMembers: refetch,
              inviteMutation,
              leaveMutation,
            });
          }}
        >
          <RegText20>멤버 관리</RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setEditing(true);
            setModalVisible(false);
          }}
        >
          <RegText20>편집</RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
      <BottomSheetModal
        modalVisible={showSortmodeModal}
        setModalVisible={setShowSortmodeModal}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        <ModalButtonBox
          onPress={() => {
            setSortMode("createdAt");
            setShowSortmodeModal(false);
          }}
        >
          <RegText20>최근 생성 순</RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setSortMode("name");
            setShowSortmodeModal(false);
          }}
        >
          <RegText20>가나다 순</RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
      {folder.saves.length > 0 ? (
        <ModalMapView
          showMap={showMap}
          setShowMap={setShowMap}
          splaces={folder.saves.map((save) => save.splace)}
        />
      ) : null}
      {editing ? null : (
        <FloatingMapButton onPress={() => setShowMap(true)}>
          <Icon
            name="map"
            style={{
              width: pixelScaler(20),
              height: pixelScaler(20),
            }}
          />
        </FloatingMapButton>
      )}
    </ScreenContainer>
  );
};

export default Folder;
