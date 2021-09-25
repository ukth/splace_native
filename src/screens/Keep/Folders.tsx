import { useLazyQuery, useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";
import { FolderType, StackGeneratorParamList, themeType } from "../../types";
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
import { GET_FOLDERS } from "../../queries";
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
  width: ${pixelScaler(175)}px;
  height: ${pixelScaler(190)}px;
  align-items: center;
`;

const Folder = ({
  folder,
  index,
  editing,
}: {
  folder: FolderType;
  index: number;
  editing: boolean;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  return (
    <FolderConatiner
      style={
        index % 2 == 0 ? { left: pixelScaler(15) } : { left: pixelScaler(15) }
      }
    >
      {editing ? (
        <DeleteButton>
          <Minus />
        </DeleteButton>
      ) : null}
      <Item
        onPress={() => {
          navigation.push("Folder", { folder });
        }}
      >
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
        <View
          style={{
            width: 1,
            height: 175,
            position: "absolute",
            backgroundColor: "#ffffff",
          }}
        />
        <View
          style={{
            width: 175,
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
  const theme = useContext<themeType>(ThemeContext);

  const { data, loading, refetch } = useQuery(GET_FOLDERS);

  const [folders, setFolders] = useState<FolderType[]>([]);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      title: "저장소",
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
    const data = await refetch();
    updateData(data);
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      {loading ? null : (
        <FlatList
          refreshing={refreshing}
          onRefresh={refresh}
          ListHeaderComponent={() => (
            <EditButtonsContainer>
              {editing ? (
                <NewFolderButton>
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
            <Folder folder={item} index={index} editing={editing} />
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
          <RegText20>최근 편집 순</RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setSortMode("generated");
            setModalVisible(false);
          }}
        >
          <RegText20>최근 생성 순</RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setSortMode("name");
            setModalVisible(false);
          }}
        >
          <RegText20>가나다 순</RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
    </ScreenContainer>
  );
};

export default Folders;