import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect } from "react";
import {
  Alert,
  FlatList,
  GestureResponderEvent,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { BLANK_IMAGE, NO_THUMBNAIL } from "../constants";
import { Icons } from "../icons";
import { ADD_SAVES, CREATE_FOLDER, GET_FOLDERS, REMOVE_SAVE } from "../queries";
import { FolderType, ThemeType } from "../types";
import { pixelScaler, showFlashMessage } from "../utils";
import BottomSheetModal from "./BottomSheetModal";
import Image from "./Image";
import { RegText13 } from "./Text";

const FolderItemContainer = styled.View`
  height: ${pixelScaler(140)}px;
  width: ${pixelScaler(95)}px;
  margin-right: ${pixelScaler(15)}px;
  align-items: center;
`;

const FolderThumbnailContainer = styled.View`
  height: ${pixelScaler(95)}px;
  width: ${pixelScaler(95)}px;
  margin-bottom: ${pixelScaler(10)}px;
  align-items: center;
  justify-content: center;
  border-radius: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.imageBackground};
`;

const RowBar = styled.View`
  position: absolute;
  height: ${pixelScaler(0.67)}px;
  width: ${pixelScaler(95)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.white};
`;

const ColumnBar = styled.View`
  position: absolute;
  height: ${pixelScaler(95)}px;
  width: ${pixelScaler(0.67)}px;
  background-color: ${({ theme }: { theme: ThemeType }) => theme.white};
`;

const SelectedBackground = styled.View`
  position: absolute;
  height: ${pixelScaler(95)}px;
  width: ${pixelScaler(95)}px;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 1;
`;

const SelectedIndicatorBackground = styled.View`
  position: absolute;
  right: ${pixelScaler(6)}px;
  top: ${pixelScaler(6)}px;
  height: ${pixelScaler(20)}px;
  width: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(20)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
  align-items: center;
  justify-content: center;
`;

const SelectedIndicator = styled.View`
  height: ${pixelScaler(14)}px;
  width: ${pixelScaler(14)}px;
  border-radius: ${pixelScaler(14)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
`;

export const ModalKeep = ({
  splaceId,
  modalVisible,
  setModalVisible,
}: {
  splaceId: number;
  modalVisible: boolean;
  setModalVisible: any;
}) => {
  const theme = useContext(ThemeContext);

  const { data, refetch, fetchMore } = useQuery(GET_FOLDERS, {
    variables: {
      orderBy: "updatedAt",
    },
  });
  // const [];

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

  const onRemoveCompleted = (data: any) => {
    const {
      removeSave: { ok, error },
    } = data;
    if (ok) {
      setModalVisible(false);
      showFlashMessage({ message: "장소가 삭제되었습니다." });
      refetch();
    } else {
      Alert.alert("삭제에 실패했습니다.\n", error);
    }
  };

  const [removeMutation, { loading: removeMutationLoading }] = useMutation(
    REMOVE_SAVE,
    {
      onCompleted: onRemoveCompleted,
    }
  );

  const onAddCompleted = (data: any) => {
    const {
      addSaves: { ok, error },
    } = data;
    if (ok) {
      setModalVisible(false);
      showFlashMessage({ message: "장소가 저장되었습니다." });
      refetch();
    } else {
      Alert.alert("장소 저장에 실패했습니다.\n", error);
    }
  };

  const [addMutation, { loading: addMutationLoading }] = useMutation(
    ADD_SAVES,
    {
      onCompleted: onAddCompleted,
    }
  );

  return (
    <BottomSheetModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      style={{
        borderTopLeftRadius: pixelScaler(20),
        borderTopRightRadius: pixelScaler(20),
        height: pixelScaler(325),
        paddingTop: pixelScaler(20),
      }}
    >
      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ width: pixelScaler(315) }}
        data={["new", ...(data?.getFolders?.folders ?? [])]}
        numColumns={3}
        ListHeaderComponent={<View style={{ height: pixelScaler(20) }} />}
        renderItem={({ item: folder }: { item: FolderType | "new" }) => {
          if (folder === "new") {
            return (
              <FolderItemContainer>
                <TouchableWithoutFeedback
                  onPress={() => {
                    Alert.prompt(
                      "새 폴더 생성",
                      "새로운 폴더의 이름을 입력하세요",
                      (text) => {
                        if (!createMutationLoading) {
                          createMutation({ variables: { title: text.trim() } });
                        }
                      },
                      "plain-text"
                    );
                  }}
                >
                  <FolderThumbnailContainer>
                    <RowBar />
                    <ColumnBar />
                  </FolderThumbnailContainer>
                </TouchableWithoutFeedback>
                <RegText13 numberOfLines={1}>새 폴더 생성</RegText13>
              </FolderItemContainer>
            );
          } else {
            const saveIdx = folder.saves
              .map((save) => save?.splace?.id)
              .indexOf(splaceId);
            return (
              <FolderItemContainer>
                <TouchableWithoutFeedback
                  onPress={() => {
                    if (!addMutationLoading) {
                      addMutation({
                        variables: {
                          splaceIds: [splaceId],
                          folderId: folder.id,
                        },
                      });
                    }
                  }}
                >
                  <FolderThumbnailContainer>
                    <Image
                      source={{
                        uri: folder.saves[0]?.splace?.thumbnail ?? NO_THUMBNAIL,
                      }}
                      style={{
                        width: pixelScaler(95),
                        height: pixelScaler(95),
                        borderRadius: pixelScaler(10),
                      }}
                    />
                    {saveIdx !== -1 ? (
                      <TouchableWithoutFeedback
                        onPress={() => {
                          if (!removeMutationLoading) {
                            removeMutation({
                              variables: {
                                saveId: folder.saves[saveIdx].id,
                                folderId: folder.id,
                              },
                            });
                          }
                        }}
                      >
                        <SelectedBackground>
                          <SelectedIndicatorBackground>
                            <SelectedIndicator />
                          </SelectedIndicatorBackground>
                        </SelectedBackground>
                      </TouchableWithoutFeedback>
                    ) : null}
                  </FolderThumbnailContainer>
                </TouchableWithoutFeedback>
                <RegText13 numberOfLines={1}>{folder.title}</RegText13>
              </FolderItemContainer>
            );
          }
        }}
        keyExtractor={(item) => (item === "new" ? item : item.id + "")}
      />
    </BottomSheetModal>
  );
};
