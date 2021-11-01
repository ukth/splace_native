import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";
import { FolderType, StackGeneratorParamList, ThemeType } from "../../types";
import { pixelScaler, strCmpFunc } from "../../utils";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16 } from "../../components/TextInput";
import {
  BldText13,
  BldText16,
  RegText13,
  RegText16,
  RegText20,
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

const FolderConatiner = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(190)}px;
  align-items: center;
`;

const MemberCountContainer = styled.View`
  position: absolute;
  right: ${pixelScaler(10)}px;
  bottom: ${pixelScaler(10)}px;
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
    // console.log(data);
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
  return (
    <FolderConatiner>
      {editing ? (
        <DeleteButton
          onPress={() => {
            Alert.alert("해당 폴더를 삭제하시겠습니까?", "", [
              // 버튼 배열
              {
                text: "취소", // 버튼 제목
                style: "cancel",
              },
              {
                text: "확인",
                onPress: () => {
                  deleteMutation({ variables: { folderId: folder.id } });
                },
              }, //버튼 제목
              // 이벤트 발생시 로그를 찍는다
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
        {folder?.saves?.length > 0 ? (
          <Image
            source={{
              uri: folder?.saves[0]?.splace?.thumbnail ?? "",
            }}
            style={{
              width: pixelScaler(145),
              height: pixelScaler(145),
              borderRadius: pixelScaler(10),
            }}
          />
        ) : (
          <View
            style={{
              width: pixelScaler(145),
              height: pixelScaler(145),
              borderRadius: pixelScaler(10),
              backgroundColor: theme.blankFolderBackground,
            }}
          />
        )}
        <View
          style={{
            width: 1,
            height: pixelScaler(145),
            position: "absolute",
            backgroundColor: "#ffffff",
          }}
        />
        <View
          style={{
            width: pixelScaler(145),
            height: 1,
            position: "absolute",
            backgroundColor: "#ffffff",
          }}
        />
        {folder.members.length > 1 ? (
          <MemberCountContainer>
            <Ionicons name="person" color={theme.folderMemberCount} />
            <BldText13 style={{ color: theme.folderMemberCount }}>
              {folder.members.length}
            </BldText13>
          </MemberCountContainer>
        ) : null}
      </Item>
      <RegText16 style={{ marginTop: pixelScaler(10) }}>
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
  const [sortMode, setSortMode] = useState<"edited" | "generated" | "name">(
    "edited"
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const theme = useContext<ThemeType>(ThemeContext);

  const { data, loading, refetch } = useQuery(GET_FOLDERS, {
    variables: {
      orderBy: "updatedAt",
    },
  });

  const [folders, setFolders] = useState<FolderType[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  navigation.addListener("focus", async () => {
    await refetch();
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>저장소</BldText16>,
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
          >
            <Ionicons name="pencil" size={26} />
          </TouchableOpacity>
        ),
    });
  }, [editing]);

  const updateData = async (data: any) => {
    if (data?.getFolders?.folders) {
      if (sortMode === "generated") {
        setFolders(
          [...data?.getFolders?.folders].sort(
            (a: FolderType, b: FolderType) =>
              Number(b.createdAt) - Number(a.createdAt)
          )
        );
      } else if (sortMode === "edited") {
        setFolders(
          [...data?.getFolders?.folders].sort(
            (a: FolderType, b: FolderType) =>
              Number(b.updatedAt) - Number(a.updatedAt)
          )
        );
      } else {
        setFolders(
          [...data?.getFolders?.folders].sort((a: FolderType, b: FolderType) =>
            strCmpFunc(a.title, b.title)
          )
        );
      }
    }
  };

  useEffect(() => {
    updateData(data);
  }, [sortMode, data]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    const data = await refetch();
    clearTimeout(timer);
    updateData(data);
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
          style={{ left: pixelScaler(17.5), width: pixelScaler(340) }}
          refreshing={refreshing}
          onRefresh={refresh}
          ListHeaderComponent={() => (
            <EditButtonsContainer>
              {editing ? (
                <NewFolderButton
                  onPress={() => {
                    Alert.prompt(
                      "새 폴더 생성",
                      "새로운 폴더의 이름을 기입하세요",
                      (text) => {
                        createMutation({ variables: { title: text.trim() } });
                      },
                      "plain-text"
                    );
                  }}
                >
                  <RegText13>+ 새 폴더</RegText13>
                </NewFolderButton>
              ) : (
                <SortButton onPress={() => setModalVisible(true)}>
                  <RegText13>
                    {sortMode === "edited"
                      ? "최근 편집 순"
                      : sortMode === "generated"
                      ? "최근 생성 순"
                      : "가나다 순"}
                  </RegText13>
                  <Ionicons name="chevron-down" />
                </SortButton>
              )}
            </EditButtonsContainer>
          )}
          data={folders}
          renderItem={({ item, index }) => (
            <Folder
              folder={item}
              index={index}
              editing={editing}
              refetch={refetch}
            />
          )}
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
            setSortMode("edited");
            setModalVisible(false);
          }}
        >
          <RegText20
            style={{
              color: sortMode === "edited" ? theme.modalHighlight : theme.text,
            }}
          >
            최근 편집 순
          </RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setSortMode("generated");
            setModalVisible(false);
          }}
        >
          <RegText20
            style={{
              color:
                sortMode === "generated" ? theme.modalHighlight : theme.text,
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
