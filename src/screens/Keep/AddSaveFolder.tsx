import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  TouchableWithoutFeedback,
  View,
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
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {
  DeleteButton,
  EditButtonsContainer,
  Minus,
  NewFolderButton,
  SortButton,
} from "../../components/Folder";
import {
  BldText13,
  BldText16,
  BldText20,
  RegText13,
  RegText16,
  RegText20,
} from "../../components/Text";
import { pixelScaler, shortenAddress, strCmpFunc } from "../../utils";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalButtonBox from "../../components/ModalButtonBox";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { Splace } from "..";
import {
  ADD_FOLDER_MEMBERS,
  ADD_SAVES,
  GET_FOLDER_INFO,
  LEAVE_FOLDER,
  REMOVE_SAVE,
} from "../../queries";
import { useMutation, useQuery } from "@apollo/client";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { Icon } from "../../components/Icon";
import { BLANK_IMAGE_D1 } from "../../constants";

export const Item = styled.View`
  width: ${pixelScaler(145)}px;
  height: ${pixelScaler(145)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-top: ${pixelScaler(15)}px;
  align-items: center;
  justify-content: center;
`;

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
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  width: ${pixelScaler(74)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(10)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const Category = styled.View`
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(20)}px;
  justify-content: center;
  padding-top: ${pixelScaler(1.3)}px;
`;

const SelectMark = styled.View`
  position: absolute;
  right: 10px;
  top: 10px;
  width: ${pixelScaler(20)}px;
  height: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(20)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.addSaveSelectMarkBackground};
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const SelectedMark = styled.View`
  width: ${pixelScaler(14)}px;
  height: ${pixelScaler(14)}px;
  border-radius: ${pixelScaler(14)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.addSaveSelectMark};
  z-index: 3;
`;

const SelectedBackground = styled.View`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.7);
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const SaveItem = ({
  save,
  splaceIds,
  setSplaceIds,
}: {
  save: SaveType;
  splaceIds: number[];
  setSplaceIds: (_: number[]) => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  return (
    <SaveItemContainer>
      <TouchableWithoutFeedback
        onPress={() => {
          setSplaceIds([1, 2, 3]);

          if (splaceIds.includes(save.splace.id)) {
            setSplaceIds(splaceIds.filter((value) => value !== save.splace.id));
          } else {
            setSplaceIds([...splaceIds, save.splace.id]);
          }
        }}
      >
        <Item>
          {splaceIds.includes(save.splace.id) ? <SelectedBackground /> : null}
          <SelectMark>
            {splaceIds.includes(save.splace.id) ? <SelectedMark /> : null}
          </SelectMark>

          <Image
            source={{
              uri: save.splace.thumbnail ?? BLANK_IMAGE_D1,
            }}
            style={{
              width: pixelScaler(145),
              height: pixelScaler(145),
              borderRadius: pixelScaler(10),
            }}
          />
        </Item>
      </TouchableWithoutFeedback>
      <InfoContainer>
        <BldText13>{save.splace.name}</BldText13>
        <BadgesContainer>
          <AddressBadge>
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
  );
};

const AddSaveFolder = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "AddSaveFolder">;
}) => {
  const [sortMode, setSortMode] = useState<"generated" | "name">("generated");
  const theme = useContext<ThemeType>(ThemeContext);
  const [folder, setFolder] = useState<FolderType>(route.params.folder);

  const [saves, setSaves] = useState<SaveType[]>();

  const [splaceIds, setSplaceIds] = useState<number[]>(route.params.splaceIds);

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
  }, [sortMode, folder]);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>{folder.title}</BldText16>,
      headerLeft: () => (
        <HeaderBackButton
          onPress={() => {
            navigation.navigate("AddSaveFolders", {
              targetFolderId: route.params.targetFolderId,
              splaceIds,
            });
          }}
        />
      ),
    });
  }, [splaceIds]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { data: folderInfo } = useQuery(GET_FOLDER_INFO, {
    variables: {
      folderId: folder.id,
    },
  });

  useEffect(() => {
    if (folderInfo?.seeFolder?.ok) {
      setFolder(folderInfo?.seeFolder?.folder);
    }
  }, [folderInfo]);

  useEffect(() => {
    // console.log("saves", saves.length);
  }, [saves]);

  return (
    <ScreenContainer>
      {!saves || saves.length > 0 ? (
        <FlatList
          style={{ left: pixelScaler(17.5) }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={() => (
            <EditButtonsContainer>
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
            </EditButtonsContainer>
          )}
          data={saves}
          renderItem={({ item, index }) => (
            <SaveItem
              save={item}
              splaceIds={splaceIds}
              setSplaceIds={setSplaceIds}
            />
          )}
          keyExtractor={(item, index) => "" + index}
          numColumns={2}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RegText16>해당 폴더는 비어있습니다</RegText16>
        </View>
      )}
    </ScreenContainer>
  );
};

export default AddSaveFolder;
