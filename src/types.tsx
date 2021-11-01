/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { Text } from "react-native";

export type AuthStackParamList = {
  LogIn: undefined;
  SignUp: undefined;
};

export type SplaceType = {
  id: number;
  name: string;
  address: string;
  detailAddress?: string;
  thumbnail?: string;
  lat: number;
  lon: number;
  itemName?: string;
  itemPrice?: number;
  menuUrls?: string[];
  intro?: string;
  url?: string;
  phone?: string;
  owner?: UserType;
  pets: boolean;
  noKids: boolean;
  parking: boolean;
  breakDays: number[];
  holidayBreak: boolean;
  totalPhotologs: number;
  timeSets?: TimeSetType[];
  fixedContents?: FixedContentType[];
  activate: boolean;
  categories?: CategoryType[];
  bigCategories?: BigCategoryType[];
  ratingtags?: RatingTagType[];
};

export type FixedContentType = {
  id: number;
  title: string;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
  splace?: SplaceType;
  photoSize: number;
  text: string;
};

export type TimeSetType = {
  id: number;
  day: number;
  open?: number;
  close?: number;
  breakOpen?: number;
  breakClose?: number;
};

export type UserType = {
  id: number;
  username?: string;
  name?: string;
  password?: string;
  email?: string;
  phone?: string;
  birthDay?: string;
  profileMessage?: string;
  profileImageUrl?: string;
  folders?: any[];
  joinedAt?: string;
  updatedAt?: string;
  followers?: UserType[];
  followings?: UserType[];
  photologs?: PhotologType[];
  likedPhotologs?: PhotologType[];
  totalFollowing?: number;
  totalFollowers?: number;
  isMe?: boolean;
  isFollowing?: boolean;
  totalLogsNumber?: number;
  url?: string;
  authority: string;
};

export type MomentType = {
  id: number;
  title: string;
  text: string;
  author: UserType;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
  splace?: SplaceType;
};

export type SaveType = {
  id: number;
  createdAt: string;
  splace: SplaceType;
};

export type FolderType = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  members: UserType[];
  saves: SaveType[];
};

export type AlbumType = {
  title: string;
  id: string;
  count: number;
  thumbnail: string;
};

export type StackGeneratorParamList = {
  Mainfeed: undefined;
  Search: undefined;
  Saved: undefined;
  Market: undefined;
  Moment: undefined;
  MomentView: {
    moments: MomentType[];
    index: number;
  };
  Splace: {
    splace: SplaceType;
  };
  EditSplace: {
    splace: SplaceType;
  };
  EditSplaceCategory: {
    splace: SplaceType;
  };
  EditSplaceInfo: {
    splace: SplaceType;
  };
  EditSplaceIntro: {
    splace: SplaceType;
  };
  EditSplaceItem: {
    splace: SplaceType;
    urls?: string[];
  };
  EditSplaceLocation: {
    splace: SplaceType;
  };
  EditSplaceOperatingtime: {
    splace: SplaceType;
  };
  EditSplaceLocationSearch: {
    splace: SplaceType;
  };
  FixedContents: {
    splace: SplaceType;
  };
  AddFixedContents: {
    splace: SplaceType;
  };
  EditFixedContents: {
    fixedContent: FixedContentType;
    splaceId: number;
  };
  SplaceLogs: {
    splace: SplaceType;
    initialScrollIndex: number;
    data: any;
    refetch: any;
    fetchMore: any;
  };
  RegisterOwner: {
    splaceId: number;
    confirmScreen: string;
  };
  SuggestInfo: {
    splace: SplaceType;
  };
  SuggestNewSplace: {
    onConfirm: (splace: SplaceType) => void;
  };
  AddressSelector: {
    onConfirm: ({
      address,
      lat,
      lon,
    }: {
      address: string;
      lat: number;
      lon: number;
    }) => void;
  };
  StackPickerAlbums: {
    rootScreen: string;
    params: any;
  };
  StackPickerAssets: {
    rootScreen: string;
    params: any;
    album: AlbumType;
  };

  MySplaces: undefined;
  SearchSplaceForAdd: undefined;
  Profile: {
    user: UserType;
  };
  Series: {
    id: number;
  };
  Payment: undefined;
  Chatroom: {
    room: RoomType;
  };
  Chatrooms: undefined;
  Members: {
    title: string;
    vars: any;
    membersData: any;
    refetchMembers: any;
    inviteMutation: any;
    leaveMutation: any;
  };
  AddMembers: {
    vars: any;
    members: UserType[];
    inviteMutation: any;
  };
  Folders: undefined;
  Folder: {
    folder: FolderType;
  };
  AddSaveFolders: {
    targetFolderId: number;
    splaceIds: number[];
  };
  AddSaveFolder: {
    folder: FolderType;
    targetFolderId: number;
    splaceIds: number[];
  };
  ProfileUsers: {
    type: "followers" | "followings";
    user: UserType;
  };
  UserLogs: {
    user: UserType;
    initialScrollIndex: number;
    data: any;
    refetch: any;
    fetchMore: any;
  };
  Log: {
    id: number;
  };
  EditProfile: {
    me: UserType;
  };
  Report: {
    type: "log" | "user" | "problem";
    id: number | undefined;
  };
  Setting: undefined;
  ChangePassword: undefined;
  EditInfo: undefined;
  BlockedUsers: undefined;
  ServicePolicy: undefined;
  TermsOfUse: undefined;
  Agreement: undefined;
  ImagesViewer: { urls: string[] };
  UploadLog: undefined;
  UploadMoment: undefined;
  UploadSeries: undefined;
  SearchSplaceForUpload: {
    listHeaderRightText: string;
    onListHeaderRightPress: ({
      location,
    }: {
      location: { lat: number; lon: number };
    }) => void;
    rootScreen: string;
  };
  SearchSplaceForLog: undefined;
  SelectCategory: undefined;
  SelectSeries: undefined;
};

export interface StackGeneratorProps {
  screenName: string;
}

export type BigCategoryType = {
  id: number;
  name: string;
};

export type CategoryType = {
  id: number;
  name: string;
};

export type RatingTagType = {
  id: number;
  name: string;
};

export type SpecialTagType = {
  id: number;
  name: string;
  color: string;
};

export type RoomType = {
  id: number;
  title: string;
  members: UserType[];
  lastMessage: MessageType;
  updatedAt: string;
  createdAt: string;
  chatroomReaded: {
    id: number;
    user: UserType;
    chatroom: RoomType;
    updatedAt: string;
  }[];
};

export type MessageType = {
  author: UserType;
  createdAt: string;
  isMine: boolean;
  id: number;
  text: string;
};

export type CardBoxPropType = {
  title: string;
  url: string;
  index: number;
  data: any[];
};

export type PhotologType = {
  id: number;
  photoSize: number;
  imageUrls: string[];
  author: UserType;
  text: string;
  categories?: CategoryType[];
  bigCategories?: BigCategoryType[];
  specialtags: SpecialTagType[];
  splace: SplaceType;
  liked: any[];
  totalLiked: number;
  seriesElements: {
    id: number;
    series: {
      id: number;
      title: string;
    };
  }[];
  isILiked: boolean;
  createdAt: string;
  isPrivate: boolean;
};

export type SeriesType = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  author: UserType;
  seriesElements: {
    id: number;
    photolog: PhotologType;
  }[];
  isPrivate: boolean;
};

export type BottomTabParamList = {
  Mainfeed: undefined;
  Search: undefined;
  Market: undefined;
  Keep: undefined;
  Profile: undefined;
};

export type ThemeType = {
  background: string;
  text: string;
  errorText: string;
  greyText: string;
  tagBorder: string;
  tagGrey: string;
  tabBarGrey: string;
  searchBarBackground: string;
  searchBarPlaceholder: string;
  dots: string;

  greyTextLight: string;
  greyTextAlone: string;

  switchTrackFalse: string;

  greyBackground: string;
  imageViewerBackground: string;

  editSplacePlaceholder: string;
  editSplaceOperationTimeDayIndicator: string;

  editSplaceBreakDayRedBackground: string;

  seriesHeaderGreyText: string;

  passwordChangeGreyText: string;
  editInfoGreyText: string;

  imageBackground: string;
  tabActive: string;
  tabInactive: string;
  searchedItemBorder: string;

  ratingTag: string;
  textHighlight: string;
  borderHighlight: string;

  chatRoomItemBorder: string;
  chatPreviewTextRead: string;
  chatPreviewUnreadMark: string;
  chatPreviewTimeText: string;

  chatRoomBackground: string;

  chatDateText: string;

  myChatBubble: string;
  otherChatBubble: string;
  chatTimeText: string;

  myChatText: string;
  otherChatText: string;

  chatEntryBorderTop: string;
  chatEntryBackground: string;
  chatEntryInputBackground: string;
  chatEntryPlaceholder: string;
  chatSelection: string;

  cameraButtonOutline: string;

  chatSendText: string;

  chatMemberSeperator: string;
  chatMemberUsername: string;
  chatMemberName: string;

  searchHistorySeperator: string;
  lightSeperator: string;

  followButton: string;
  followButtonText: string;

  profileTabBarBorderBottom: string;
  profileFocusedTabBorderBottom: string;

  greyButton: string;

  greyButtonContext: string;

  entry: string;
  entryPlaceholder: string;
  entrySelection: string;

  chatInviteSelect: string;
  chatInviteSelected: string;
  chatInviteConfirmText: string;

  headerConfirmText: string;

  folderDeleteButtonBackground: string;
  folderDeleteMinus: string;
  folderNoticeBadgeBackground: string;
  blankFolderBackground: string;

  addSaveSelectMarkBackground: string;
  addSaveSelectMark: string;

  folderMemberCount: string;

  profileLink: string;
  editProfileSeperator: string;
  editProfileTextGrey: string;

  modalHighlight: string;
  modalInputSubmitButton: string;
  modalEntry: string;

  modalButtonRedText: string;

  themeBackground: string;

  white: string;
  black: string;
};
