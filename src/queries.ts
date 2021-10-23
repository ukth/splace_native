import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
    name
    profileImageUrl
    isFollowing
    isMe
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    text
    createdAt
    # author {
    #   ...UserFragment
    # }
  }
  ${USER_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomFragment on Chatroom {
    id
    title
    updatedAt
    createdAt
    members {
      isFollowing
      ...UserFragment
    }
    lastMessage {
      ...MessageFragment
    }
    chatroomReaded {
      id
      user {
        ...UserFragment
      }
      updatedAt
    }
  }
  ${USER_FRAGMENT}
  ${MESSAGE_FRAGMENT}
`;

export const SPLACE_FRAGMENT = gql`
  fragment SplaceFragment on Splace {
    id
    name
    address
    thumbnail
    lat
    lon
    activate
    detailAddress
    # ratingtags {
    #   id
    #   name
    # }
    categories {
      id
      name
    }
  }
`;

export const FOLDER_FRAGMENT = gql`
  fragment FolderFragment on Folder {
    id
    title
    createdAt
    updatedAt
    members {
      ...UserFragment
    }
    saves {
      id
      createdAt
      splace {
        ...SplaceFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${SPLACE_FRAGMENT}
`;

export const SERIES_FRAGMENT = gql`
  fragment SeriesFragment on Series {
    id
    author {
      ...UserFragment
    }
    title
    photologs {
      id
      imageUrls
    }
    createdAt
  }
  ${USER_FRAGMENT}
`;

export const LOG_FRAGMENT = gql`
  fragment LogFragment on Photolog {
    id
    photoSize
    text
    categories {
      id
      name
    }
    totalLiked
    series {
      title
      id
    }
    imageUrls
    author {
      ...UserFragment
    }
    splace {
      ...SplaceFragment
    }
    isILiked
    createdAt
  }
  ${USER_FRAGMENT}
  ${SPLACE_FRAGMENT}
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      user {
        id
      }
    }
  }
`;

export const GET_ME = gql`
  query getMe {
    getMe {
      ok
      error
      me {
        ...UserFragment
        email
        phone
        birthDay
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_FEED = gql`
  query getFeed($lastLogId: Int, $lastSeriesId: Int) {
    getFeed(lastLogId: $lastLogId, lastSeriesId: $lastSeriesId) {
      ok
      error
      logs {
        ...LogFragment
      }
      series {
        ...SeriesFragment
      }
    }
  }
  ${LOG_FRAGMENT}
  ${SERIES_FRAGMENT}
`;

export const GET_SERIES = gql`
  query getLogsBySeries($seriesId: Int!, $lastId: Int) {
    getLogsBySeries(seriesId: $seriesId, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_SERIES_INFO = gql`
  query seeSeries($seriesId: Int!) {
    seeSeries(seriesId: $seriesId) {
      ok
      error
      series {
        id
        title
        author {
          ...UserFragment
        }
        createdAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LIKE_PHOTOLOG = gql`
  mutation likePhotolog($photologId: Int!) {
    likePhotolog(photologId: $photologId) {
      ok
      error
    }
  }
`;

export const UNLIKE_PHOTOLOG = gql`
  mutation unlikePhotolog($photologId: Int!) {
    unlikePhotolog(photologId: $photologId) {
      ok
      error
    }
  }
`;

export const GET_PROFILE = gql`
  query seeProfile($userId: Int!) {
    seeProfile(userId: $userId) {
      ok
      error
      profile {
        url
        photologs {
          id
          imageUrls
        }
        profileMessage
        totalFollowers
        totalFollowing
        totalLogsNumber
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_FOLLOWERS = gql`
  query seeFollowers($userId: Int!, $keyword: String, $lastId: Int) {
    seeFollowers(userId: $userId, keyword: $keyword, lastId: $lastId) {
      ok
      error
      followers {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_FOLLOWINGS = gql`
  query seeFollowings($userId: Int!, $keyword: String, $lastId: Int) {
    seeFollowings(userId: $userId, keyword: $keyword, lastId: $lastId) {
      ok
      error
      followings {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const FOLLOW = gql`
  mutation followUser($targetId: Int!) {
    followUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const UNFOLLOW = gql`
  mutation unfollowUser($targetId: Int!) {
    unfollowUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const GET_ROOMS = gql`
  query getMyRooms($lastId: Int) {
    getMyRooms(lastId: $lastId) {
      ok
      error
      myRooms {
        ...RoomFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${ROOM_FRAGMENT}
`;

export const GET_MESSAGES = gql`
  query getRoomMessages($chatroomId: Int!) {
    getRoomMessages(chatroomId: $chatroomId) {
      id
      ok
      error
      messages {
        id
        text
        author {
          id
          username
          name
        }
        createdAt
        isMine
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!, $chatroomId: Int!) {
    sendMessage(text: $text, chatroomId: $chatroomId) {
      ok
      error
      message {
        id
        text
        author {
          ...UserFragment
        }
        createdAt
        isMine
      }
      readedRecord {
        id
        updatedAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const CREATE_ROOM = gql`
  mutation createChatroom(
    $title: String!
    $memberIds: [Int]!
    $isPersonal: Boolean!
  ) {
    createChatroom(
      title: $title
      memberIds: $memberIds
      isPersonal: $isPersonal
    ) {
      ok
      error
      chatroom {
        ...RoomFragment
      }
    }
  }
  ${ROOM_FRAGMENT}
`;

export const READ_ROOM = gql`
  mutation readChatroom($chatroomId: Int!) {
    readChatroom(chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const GET_ROOM_INFO = gql`
  query getRoomInfo($chatroomId: Int!) {
    getRoomInfo(chatroomId: $chatroomId) {
      ok
      error
      room {
        id
        title
        members {
          ...UserFragment
        }
        createdAt
        updatedAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const NEW_MESSAGE = gql`
  subscription newMessage($chatroomId: Int!) {
    newMessage(chatroomId: $chatroomId) {
      id
      text
      author {
        ...UserFragment
      }
      createdAt
      isMine
    }
  }
  ${USER_FRAGMENT}
`;

export const ROOM_UPDATE = gql`
  subscription chatroomUpdated {
    chatroomUpdated {
      id
      title
      members {
        ...UserFragment
      }
      lastMessage {
        id
        text
        createdAt
      }
      updatedAt
    }
  }
  ${USER_FRAGMENT}
`;

export const EDIT_ROOM_TITLE = gql`
  mutation editChatroom($title: String!, $chatroomId: Int!) {
    editChatroom(title: $title, chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const LEAVE_ROOM = gql`
  mutation quitChatroom($chatroomId: Int!) {
    quitChatroom(chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const ADD_ROOM_MEMBERS = gql`
  mutation addChatMembers($chatroomId: Int!, $memberIds: [Int]!) {
    addChatMembers(chatroomId: $chatroomId, memberIds: $memberIds) {
      ok
      error
    }
  }
`;

export const CREATE_FOLDER = gql`
  mutation createFolder($title: String!) {
    createFolder(title: $title) {
      ok
      error
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation deleteFolder($folderId: Int!) {
    deleteFolder(folderId: $folderId) {
      ok
      error
    }
  }
`;

export const LEAVE_FOLDER = gql`
  mutation quitFolder($folderId: Int!) {
    quitFolder(folderId: $folderId) {
      ok
      error
    }
  }
`;

export const ADD_FOLDER_MEMBERS = gql`
  mutation addFolderMembers($folderId: Int!, $memberIds: [Int]!) {
    addFolderMembers(folderId: $folderId, memberIds: $memberIds) {
      ok
      error
    }
  }
`;

export const GET_FOLDERS = gql`
  query getFolders($lastId: Int) {
    getFolders(lastId: $lastId) {
      ok
      error
      folders {
        ...FolderFragment
      }
    }
  }
  ${FOLDER_FRAGMENT}
`;

export const GET_FOLDER_INFO = gql`
  query seeFolder($folderId: Int!) {
    seeFolder(folderId: $folderId) {
      ok
      error
      folder {
        ...FolderFragment
      }
    }
  }
  ${FOLDER_FRAGMENT}
`;

export const REMOVE_SAVE = gql`
  mutation removeSave($saveId: Int!, $folderId: Int!) {
    removeSave(saveId: $saveId, folderId: $folderId) {
      ok
      error
    }
  }
`;

export const GET_USER_LOGS = gql`
  query getUserLogs($userId: Int!, $lastId: Int) {
    getUserLogs(userId: $userId, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_USER_SERIES = gql`
  query getUserSeries($userId: Int!, $lastId: Int) {
    getUserSeries(userId: $userId, lastId: $lastId) {
      ok
      error
      series {
        ...SeriesFragment
      }
    }
  }
  ${SERIES_FRAGMENT}
`;

export const GET_LOG = gql`
  query seePhotolog($photologId: Int!) {
    seePhotolog(photologId: $photologId) {
      ok
      error
      log {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const EDIT_PROFILE = gql`
  mutation editProfile(
    $name: String
    $username: String
    $profileMessage: String
    $profileImageUrl: String
    $url: String
  ) {
    editProfile(
      name: $name
      username: $username
      profileMessage: $profileMessage
      profileImageUrl: $profileImageUrl
      url: $url
    ) {
      ok
      error
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation editProfile($password: String) {
    editProfile(password: $password) {
      ok
      error
    }
  }
`;

export const EDIT_MY_INFO = gql`
  mutation editProfile($email: String, $birthDay: String) {
    editProfile(email: $email, birthDay: $birthDay) {
      ok
      error
    }
  }
`;

export const EDIT_FOLDER = gql`
  mutation editFolder($folderId: Int!, $title: String!) {
    editFolder(folderId: $folderId, title: $title) {
      ok
      error
    }
  }
`;

export const ADD_SAVES = gql`
  mutation addSaves($splaceIds: [Int]!, $folderId: Int!) {
    addSaves(splaceIds: $splaceIds, folderId: $folderId) {
      ok
      error
    }
  }
`;

export const BLOCK = gql`
  mutation blockUser($targetId: Int!) {
    blockUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const UNBLOCK = gql`
  mutation unblockUser($targetId: Int!) {
    unblockUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const GET_BLOCKED_USER = gql`
  query getMyBlockedUser {
    getMyBlockedUser {
      ok
      error
      users {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const REPORT = gql`
  mutation reportResources(
    $sourceType: String!
    $sourceId: Int
    $reason: String
  ) {
    reportResources(
      sourceType: $sourceType
      sourceId: $sourceId
      reason: $reason
    ) {
      ok
      error
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation deleteAccount {
    deleteAccount {
      ok
      error
    }
  }
`;

export const GET_MOMENTS = gql`
  query getMyMoments($lastId: Int) {
    getMyMoments(lastId: $lastId) {
      ok
      error
      moments {
        id
        text
        author {
          ...UserFragment
        }
        videoUrl
        createdAt
        updatedAt
        splace {
          ...SplaceFragment
        }
      }
    }
  }
  ${USER_FRAGMENT}
  ${SPLACE_FRAGMENT}
`;

export const GET_SPLACE_INFO = gql`
  query seeSplace($splaceId: Int!) {
    seeSplace(splaceId: $splaceId) {
      ok
      error
      splace {
        ...SplaceFragment
        owner {
          ...UserFragment
        }
        parking
        pets
        noKids
        intro
        url
        phone
        breakDays
        holidayBreak
        timeSets {
          id
          day
          open
          close
          breakOpen
          breakClose
          createdAt
          updatedAt
        }
        itemName
        itemPrice
        totalPhotologs
      }
    }
  }
  ${SPLACE_FRAGMENT}
  ${USER_FRAGMENT}
`;

export const GET_LOGS_BY_SPLACE = gql`
  query getLogsBySplace($splaceId: Int!, $orderBy: String!, $lastId: Int) {
    getLogsBySplace(splaceId: $splaceId, orderBy: $orderBy, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const EDIT_SPLACE = gql`
  mutation editSplaces(
    $splaceId: Int!
    $name: String
    $phone: String
    $url: String
    $itemName: String
    $itemPrice: Int
    $menuUrls: [String]
    $intro: String
    $detailAddress: String
    $parking: Boolean
    $pets: Boolean
    $kids: Boolean
    $thumbnail: Boolean
  ) {
    editSplaces(
      splaceId: $splaceId
      name: $name
      phone: $phone
      url: $url
      itemName: $itemName
      itemPrice: $itemPrice
      menuUrls: $menuUrls
      intro: $intro
      detailAddress: $detailAddress
      parking: $parking
      pets: $pets
      kids: $kids
      thumbnail: $thumbnail
    ) {
      ok
      error
    }
  }
`;

export const EDIT_SPLACE_TIMESETS = gql`
  mutation editTimeSets(
    $splaceId: Int!
    $breakDays: [Int]!
    $sun: [Int]!
    $mon: [Int]!
    $tue: [Int]!
    $wed: [Int]!
    $thr: [Int]!
    $fri: [Int]!
    $sat: [Int]!
    $holidayBreak: Boolean!
  ) {
    editTimeSets(
      splaceId: $splaceId
      breakDays: $breakDays
      sun: $sun
      mon: $mon
      tue: $tue
      wed: $wed
      thr: $thr
      fri: $fri
      sat: $sat
      holidayBreak: $holidayBreak
    ) {
      ok
      error
    }
  }
`;
