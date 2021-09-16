import { color } from "react-native-reanimated";

const colors = {
  white: "#ffffff",
  black: "#000000",
  red: "#e84118",
  grey_a: "#a0a0a0",
  grey_b: "#b0b0b0",
  grey_c: "#c0c0c0",
  grey_d: "#d0d0d0",
  grey_e: "#e0e0e0",
  grey_f: "#f0f0f0",
  grey_f8: "#f8f8f8",
  grey_ae: "#aeaeb2",
  grey_a7: "#a7a7a7",
  grey_c7: "#c7c7cc",
  grey_c4: "#c4c4c4",
  grey_e5: "#e5e5ea",
  grey_f2: "#f2f2f7",
  theme: "#00a4b7",
  chatTheme: "#00bcd1",
  apple_grey: "rgba(60, 60, 67, 0.6)",
  grey_border: "rgba(0, 0, 0, 0.6)",
};

export const theme = {
  light: {
    background: colors.white,
    text: colors.black,
    errorText: colors.red,
    greyText: colors.apple_grey,
    tagBorder: colors.black,
    tagGreyBorder: colors.black,
    tabBarGrey: colors.grey_ae,
    searchBarBackground: colors.grey_f2,
    searchBarPlaceholder: colors.grey_c7,
    dots: colors.black,

    imageBackground: colors.grey_f8,
    tabActive: colors.black,
    tabInactive: colors.black,
    searchedItemBorder: colors.grey_c4,

    ratingTag: colors.theme,
    textHighlight: colors.theme,

    chatRoomItemBorder: colors.grey_c4,
    chatPreviewTextRead: colors.grey_ae,
    chatPreviewUnreadMark: colors.chatTheme,
    chatPreviewTimeText: colors.grey_ae,

    chatRoomBackground: colors.white,

    chatDateText: colors.grey_c7,

    myChatBubble: colors.chatTheme,
    otherChatBubble: colors.grey_f2,
    chatTimeText: colors.grey_c7,

    myChatText: colors.white,
    otherChatText: colors.black,

    chatEntryBorderTop: colors.grey_c4,
    chatEntryBackground: colors.white,
    chatEntryInputBackground: colors.grey_f2,
    chatEntryPlaceholder: colors.grey_a7,
    chatSelection: colors.theme,

    chatSendText: colors.theme,

    chatMemberSeperator: colors.grey_e5,
    chatMemberUsername: colors.black,
    chatMemberName: colors.grey_ae,

    followButton: colors.chatTheme,
    followButtonText: colors.white,

    white: colors.white,
  },
  dark: {
    background: colors.white,
    text: colors.black,
    errorText: colors.red,
    theme: colors.theme,

    imageBackground: colors.grey_c,
    tabActive: colors.black,
    tabInactive: colors.black,
  },
};
