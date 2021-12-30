import {
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React, { Component, useContext, useEffect, useState } from "react";
import {
  Alert,
  Animated,
  FlatList,
  TouchableOpacity,
  Image as DefaultImage,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";
import {
  FolderType,
  RootStackParamList,
  StackGeneratorParamList,
  ThemeType,
} from "../../types";
import { pixelScaler, strCmpFunc } from "../../utils";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16 } from "../../components/TextInput";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
  RegText20,
  RegText9,
} from "../../components/Text";
import { CREATE_FOLDER, DELETE_FOLDER, GET_FOLDERS } from "../../queries";
import Image from "../../components/Image";
import { abs } from "react-native-reanimated";
import Navigation from "../../navigation";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import {
  DeleteButton,
  EditButtonsContainer,
  Item,
  Minus,
  NewFolderButton,
  SortButton,
} from "../../components/Folder";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import ModalButtonBox from "../../components/ModalButtonBox";
import BottomSheetModal from "../../components/BottomSheetModal";
import { Icon } from "../../components/Icon";
import { BLANK_IMAGE, BLANK_IMAGE_FOLDER, NO_THUMBNAIL } from "../../constants";
import { menualCheckedVar } from "../../apollo";
import { ScrollView } from "react-native-gesture-handler";

const FolderConatiner = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(190)}px;
  align-items: center;
`;

const MemberCountContainer = styled.View`
  position: absolute;
  right: ${pixelScaler(10)}px;
  bottom: ${pixelScaler(9.3)}px;
  flex-direction: row;
`;

const Folder = ({
  folder,
  index,
  editing,
  refetch,
}: {
  folder: FolderType;
  index: number;
  editing: boolean;
  refetch: () => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const theme = useContext<ThemeType>(ThemeContext);

  const onDeleteCompleted = (data: any) => {
    const {
      deleteFolder: { ok, error },
    } = data;
    if (ok) {
      Alert.alert("폴더가 삭제되었습니다.\n", error);
      refetch();
    } else {
      Alert.alert("폴더 삭제에 실패했습니다.\n", error);
    }
  };

  const [deleteMutation, { loading: deleteMutationLoading }] = useMutation(
    DELETE_FOLDER,
    {
      onCompleted: onDeleteCompleted,
    }
  );

  const saves_thumbnail = folder?.saves?.filter(
    (save) => save?.splace?.thumbnail?.length
  );
  const thumbnail =
    saves_thumbnail.length > 0
      ? saves_thumbnail[saves_thumbnail.length - 1].splace.thumbnail
      : NO_THUMBNAIL;

  return (
    <FolderConatiner>
      {editing ? (
        <DeleteButton
          onPress={() => {
            Alert.alert("해당 폴더를 삭제하시겠습니까?", "", [
              {
                text: "취소",
                style: "cancel",
              },
              {
                text: "확인",
                onPress: () => {
                  deleteMutation({ variables: { folderId: folder.id } });
                },
              },
            ]);
          }}
        >
          <Minus />
        </DeleteButton>
      ) : null}
      <Item
        onPress={() => {
          navigation.push("Folder", { folder });
        }}
      >
        {folder?.saves?.length === 0 ? (
          <Image
            source={{
              uri: thumbnail ?? NO_THUMBNAIL,
            }}
            style={{
              width: pixelScaler(145),
              height: pixelScaler(145),
              borderRadius: pixelScaler(10),
              borderWidth: pixelScaler(0.4),
              borderColor: theme.imageBorder,
            }}
          />
        ) : (
          <Image
            source={{
              uri:
                folder?.saves?.filter(
                  (save) => save?.splace?.thumbnail?.length
                )[0].splace.thumbnail ?? NO_THUMBNAIL,
            }}
            style={{
              width: pixelScaler(145),
              height: pixelScaler(145),
              borderRadius: pixelScaler(10),
              borderWidth: pixelScaler(0.4),
              borderColor: theme.imageBorder,
            }}
          />
        )}
        {folder.members.length > 1 ? (
          <MemberCountContainer>
            <Ionicons name="person" color={theme.folderMemberCount} />
            <BldText13 style={{ color: theme.folderMemberCount }}>
              {folder.members.length}
            </BldText13>
          </MemberCountContainer>
        ) : null}
      </Item>
      <RegText16 numberOfLines={1} style={{ marginTop: pixelScaler(10) }}>
        {folder.title}
      </RegText16>
    </FolderConatiner>
  );
};

const Folders = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Folders">;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<"updatedAt" | "createdAt" | "name">(
    "updatedAt"
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const theme = useContext<ThemeType>(ThemeContext);

  const { data, loading, refetch, fetchMore } = useQuery(GET_FOLDERS, {
    variables: {
      orderBy: "updatedAt",
    },
  });

  const [folders, setFolders] = useState<FolderType[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const menualChecked = useReactiveVar(menualCheckedVar);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>공간 저장소</BldText16>,
    });
    if (menualChecked < 4) {
      const mainStack = navigation
        .getParent()
        ?.getParent<StackNavigationProp<RootStackParamList>>();
      if (mainStack?.push) {
        mainStack.push("Manual", { n: 2 });
      }
    }
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        editing ? (
          <HeaderRightConfirm
            onPress={() => {
              setEditing(!editing);
            }}
          />
        ) : (
          <TouchableOpacity
            onPress={() => {
              setEditing(!editing);
            }}
            hitSlop={{
              top: pixelScaler(10),
              bottom: pixelScaler(10),
              right: pixelScaler(10),
              left: pixelScaler(10),
            }}
          >
            <Icon
              name="edit"
              style={{
                width: pixelScaler(16),
                height: pixelScaler(16),
                marginRight: pixelScaler(30),
              }}
            />
          </TouchableOpacity>
        ),
    });
  }, [editing]);

  // const updateData = async (data: any) => {
  //   if (data?.getFolders?.folders) {
  //     if (sortMode === "createdAt") {
  //       setFolders(
  //         [...data?.getFolders?.folders].sort(
  //           (a: FolderType, b: FolderType) =>
  //             Number(b.createdAt) - Number(a.createdAt)
  //         )
  //       );
  //     } else if (sortMode === "updatedAt") {
  //       setFolders(
  //         [...data?.getFolders?.folders].sort(
  //           (a: FolderType, b: FolderType) =>
  //             Number(b.updatedAt) - Number(a.updatedAt)
  //         )
  //       );
  //     } else {
  //       setFolders(
  //         [...data?.getFolders?.folders].sort((a: FolderType, b: FolderType) =>
  //           strCmpFunc(a.title, b.title)
  //         )
  //       );
  //     }
  //   }
  // };

  // useEffect(() => {
  //   updateData(data);
  // }, [sortMode, data]);

  useEffect(() => {
    refetch({ orderBy: sortMode });
  }, [sortMode]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    const data = await refetch();
    clearTimeout(timer);
    // updateData(data);
    setRefreshing(false);
  };

  const onCreateCompleted = (data: any) => {
    const {
      createFolder: { ok, error },
    } = data;
    if (ok) {
      refetch();
    } else {
      Alert.alert("폴더 생성에 실패했습니다.\n", error);
    }
  };

  const [createMutation, { loading: createMutationLoading }] = useMutation(
    CREATE_FOLDER,
    {
      onCompleted: onCreateCompleted,
    }
  );

  return (
    <ScreenContainer>
      {loading ? null : (
        <FlatList
          style={{
            left: pixelScaler(17.5),
            width: pixelScaler(340),
          }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refresh}
          ListHeaderComponent={() => (
            <EditButtonsContainer>
              {editing ? (
                <RegText13
                  onPress={() => {
                    Alert.prompt(
                      "새 폴더 생성",
                      "새로운 폴더의 이름을 입력하세요",
                      (text) => {
                        createMutation({ variables: { title: text.trim() } });
                      },
                      "plain-text"
                    );
                  }}
                  style={{
                    // backgroundColor: "#98f",
                    marginTop: pixelScaler(20),
                    color: theme.textHighlight,
                  }}
                >
                  {"새 폴더 추가"}
                </RegText13>
              ) : (
                <SortButton onPress={() => setModalVisible(true)}>
                  <RegText13 style={{}}>
                    {sortMode === "updatedAt"
                      ? "최근 편집 순"
                      : sortMode === "createdAt"
                      ? "최근 생성 순"
                      : "가나다 순"}
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
              )}
            </EditButtonsContainer>
          )}
          data={data?.getFolders?.folders}
          renderItem={({ item, index }) => (
            <Folder
              folder={item}
              index={index}
              editing={editing}
              refetch={refetch}
            />
          )}
          onEndReached={() => {
            fetchMore({
              variables: {
                lastId:
                  data?.getFolders?.folders[
                    data?.getFolders?.folders.length - 1
                  ].id,
                orderBy: sortMode,
              },
            });
          }}
          keyExtractor={(item, index) => "" + index}
          numColumns={2}
        />
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
            setSortMode("updatedAt");
            setModalVisible(false);
          }}
        >
          <RegText20
            style={{
              color:
                sortMode === "updatedAt" ? theme.modalHighlight : theme.text,
            }}
          >
            최근 편집 순
          </RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setSortMode("createdAt");
            setModalVisible(false);
          }}
        >
          <RegText20
            style={{
              color:
                sortMode === "createdAt" ? theme.modalHighlight : theme.text,
            }}
          >
            최근 생성 순
          </RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setSortMode("name");
            setModalVisible(false);
          }}
        >
          <RegText20
            style={{
              color: sortMode === "name" ? theme.modalHighlight : theme.text,
            }}
          >
            가나다 순
          </RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
    </ScreenContainer>
  );
};

export default Folders;
