import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";

import Image from "../../components/Image";
import { SaveType, StackGeneratorParamList, themeType } from "../../types";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { HeaderBackButton, StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {
  DeleteButton,
  EditButtonsContainer,
  Item,
  Minus,
  NewFolderButton,
  SortButton,
} from "../../components/Folder";
import { BldText13, RegText13, RegText20 } from "../../components/Text";
import { pixelScaler, strCmpFunc } from "../../utils";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalButtonBox from "../../components/ModalButtonBox";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { Splace } from "..";

const SaveItemContainer = styled.View`
  width: ${pixelScaler(175)}px;
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

const AddressBadge = styled.TouchableOpacity`
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  width: ${pixelScaler(74)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(10)}px;
`;

const Category = styled.TouchableOpacity`
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(20)}px;
  justify-content: center;
`;

const SaveItem = ({
  save,
  index,
  editing,
}: {
  save: any;
  index: number;
  editing: boolean;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  return (
    <SaveItemContainer
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
          navigation.push("Splace", {
            splace: {
              id: 1,
              name: "test",
              market: true,
            },
          });
        }}
      >
        <Image
          source={{
            uri: save.splace.thumbnail,
          }}
          style={{
            width: pixelScaler(145),
            height: pixelScaler(145),
            borderRadius: pixelScaler(10),
          }}
        />
      </Item>
      <InfoContainer>
        <BldText13>{save.splace.name}</BldText13>
        <BadgesContainer>
          <AddressBadge>
            <RegText13>{save.splace.address}</RegText13>
          </AddressBadge>
          <Category>
            <RegText13>{"카테고리"}</RegText13>
          </Category>
        </BadgesContainer>
      </InfoContainer>
    </SaveItemContainer>
  );
};

const Folder = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Folder">;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<"generated" | "name">("generated");
  const theme = useContext<themeType>(ThemeContext);
  const { folder } = route.params;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [saves, setSaves] = useState<SaveType[]>([]);

  useEffect(() => {
    if (sortMode === "generated") {
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
  }, [sortMode]);

  // const { data, loading } = useQuery(GET_FOLDERS);

  // const [read_chatroom, { loading }] = useMutation(READ_CHATROOM);

  // const onInviteCompleted = (data: {
  //   addChatMembers: {
  //     ok: boolean;
  //     error: string;
  //   };
  // }) => {
  //   const {
  //     addChatMembers: { ok, error },
  //   } = data;
  //   if (ok) {
  //     navigation.pop();
  //   } else {
  //     // console.log(data);
  //     Alert.alert("초대에 실패하였습니다.\n", error);
  //   }
  // };

  // const [inviteMutation, { loading: inviteMutationLoading }] = useMutation(
  //   ADD_CHAT_MEMBERS,
  //   {
  //     onCompleted: onInviteCompleted,
  //   }
  // );

  // const onLeaveCompleted = (data: any) => {
  //   const {
  //     quitChatroom: { ok, error },
  //   } = data;
  //   if (ok) {
  //     navigation.navigate("Chatrooms");
  //   } else {
  //     Alert.alert("채팅방을 나갈 수 없습니다.\n", error);
  //   }
  // };
  // const [leaveMutation, { loading: leaveMutationLoading }] = useMutation(
  //   LEAVE_CHATROOM,
  //   {
  //     onCompleted: onLeaveCompleted,
  //   }
  // );

  // const {
  //   data: roomInfo,
  //   loading: roomInfoLoading,
  //   refetch: refetchMembers,
  // } = useQuery(GET_ROOM_INFO, {
  //   variables: { chatroomId: chatroom.id },
  // });

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      title: folder.title,
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
    });
  }, [editing]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const refresh = async () => {
    setRefreshing(true);
    // await updateMembers();
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <FlatList
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={() => (
          <EditButtonsContainer>
            {editing ? (
              <NewFolderButton>
                <RegText13>+ 추가하기</RegText13>
              </NewFolderButton>
            ) : (
              <SortButton
                onPress={() => {
                  if (sortMode === "generated") {
                    setSortMode("name");
                  } else {
                    setSortMode("generated");
                  }
                }}
              >
                <RegText13>
                  {sortMode === "generated" ? "최근 생성 순" : "가나다 순"}
                </RegText13>
                <Ionicons name="chevron-down" />
              </SortButton>
            )}
          </EditButtonsContainer>
        )}
        data={folder.saves}
        renderItem={({ item, index }) => (
          <SaveItem save={item} index={index} editing={editing} />
        )}
        keyExtractor={(item, index) => "" + index}
        numColumns={2}
      />
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        <ModalButtonBox onPress={() => {}}>
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
    </ScreenContainer>
  );
};

export default Folder;
