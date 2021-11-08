export type AuthStackParamList = {
  InitialScreen: undefined;
  LogIn: undefined;
  RegistrationStack: undefined;
  CertifyForUsername: undefined;
  CertifyForPassword: undefined;
  ShowUsername: { token: string };
  ChangePassword: { token: string };
};

export type RegistrationStackParamList = {
  CertifyPhone: undefined;
  SignUp: { token: string; phone: string };
  SignUpConfirm: { username: string };
  TasteCup: undefined;
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
  ratingtags?: RatingtagType[];
  isSaved: boolean;
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
  thumbnail: string;
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
  CreateChatroom: undefined;
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
  EditPhotolog: {
    photolog: PhotologType;
  };
  EditSeries: {
    series: SeriesType;
  };
  LogsByCategory: {
    category: CategoryType;
  };
  LogsByBigCategory: {
    bigCategory: BigCategoryType;
  };
  Notification: undefined;
  SplacesByRatingtag: { ratingtag: RatingtagType };
  Filter: undefined;
  ScrappedContents: undefined;
  SearchSplaceForFilter: undefined;
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

export type RatingtagType = {
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
  splace?: SplaceType;
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
  isScraped: boolean;
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
  isScraped: boolean;
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

  ratingtag: string;
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
  notificationSeperator: string;

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
  greyTextLighter: string;
};

export type IconName =
  | "bigcoins"
  | "arrow_right"
  | "header_back"
  | "bookmark_thin"
  | "bookmark_black"
  | "bookmark_color"
  | "bookmark_fill"
  | "box_plus"
  | "box"
  | "super"
  | "super_necklace"
  | "super_sad"
  | "super_ok"
  | "super_smallheart"
  | "super_bigheart"
  | "super_hot"
  | "super_superhot"
  | "super_tasty"
  | "super_supertasty"
  | "super_inbox"
  | "edit"
  | "empty_heart"
  | "filter"
  | "gallery_black"
  | "gallery_white"
  | "heart_colorfill"
  | "heartplus"
  | "home_black"
  | "home_color"
  | "lock_black"
  | "lock_white"
  | "map"
  | "messagebox"
  | "myposition"
  | "notification"
  | "notification_new"
  | "positionpin"
  | "profile_black"
  | "profile_color"
  | "purchaselist"
  | "search_black"
  | "search_color"
  | "search_grey"
  | "shop_black"
  | "shop_color"
  | "smallcoins_pisa"
  | "smallcoins_straight"
  | "threedot"
  | "menu"
  | "uplog"
  | "wishlist"
  | "close_white"
  | "close"
  | "messagebox_add";
