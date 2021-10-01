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
import {
  FolderType,
  SaveType,
  StackGeneratorParamList,
  themeType,
} from "../../types";
import { pixelScaler, strCmpFunc } from "../../utils";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { BldTextInput16 } from "../../components/TextInput";
import {
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
  EditButtonsContainer,
  Item,
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

const Folder = ({
  folder,
  index,

  refetch,
}: {
  folder: FolderType;
  index: number;

  refetch: () => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  const theme = useContext<themeType>(ThemeContext);

  return (
    <FolderConatiner>
      <Item
        onPress={() => {
          navigation.push("AddSaveFolder", { folder });
        }}
      >
        {folder.saves.length > 0 ? (
          <Image
            source={{
              uri: folder.saves[0]?.splace.thumbnail ?? "",
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
      </Item>
      <RegText16 style={{ marginTop: pixelScaler(10) }}>
        {folder.title}
      </RegText16>
    </FolderConatiner>
  );
};

const AddSaveFolders = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "AddSaveFolders">;
}) => {
  const [sortMode, setSortMode] = useState<"edited" | "generated" | "name">(
    "edited"
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const theme = useContext<themeType>(ThemeContext);

  const { data, loading, refetch } = useQuery(GET_FOLDERS);

  const [folders, setFolders] = useState<FolderType[]>([]);

  const [folderSaves, setFolderSaves] = useState<SaveType[]>(
    route.params.folder.saves
  );

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  navigation.addListener("focus", async () => {
    await refetch();
  });

  useEffect(() => {
    navigation.setOptions({
      title: "추가하기",
      headerRight: () => <HeaderRightConfirm onPress={() => {}} />,
    });
  }, []);

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

  return (
    <ScreenContainer>
      {loading ? null : (
        <FlatList
          style={{ left: pixelScaler(17.5) }}
          refreshing={refreshing}
          onRefresh={refresh}
          ListHeaderComponent={() => (
            <EditButtonsContainer>
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
            </EditButtonsContainer>
          )}
          data={folders}
          renderItem={({ item, index }) => (
            <Folder
              folder={item}
              index={index}
              refetch={refetch}
              // folderSaves={folderSaves}
              // setFolderSaves={setFolderSaves}
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

export default AddSaveFolders;
