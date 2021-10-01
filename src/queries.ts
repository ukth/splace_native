import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFragement on User {
    id
    username
    name
    profileImageUrl
    isFollowing
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragement on Message {
    id
    text
    createdAt
  }
  ${USER_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomFragement on Chatroom {
    id
    title
    updatedAt
    createdAt
    members {
      isFollowing
      ...UserFragement
    }
    lastMessage {
      ...MessageFragement
    }
    chatroomReaded {
      id
      user {
        ...UserFragement
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
    geolat
    geolog
  }
`;

export const FOLDER_FRAGMENT = gql`
  fragment FolderFragement on Folder {
    id
    title
    createdAt
    updatedAt
    members {
      ...UserFragement
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
  fragment SeriesFragement on Series {
    id
    author {
      ...UserFragement
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
        id
        username
        profileImageUrl
      }
    }
  }
`;

export const GET_FEED = gql`
  query getFeed($lastLogId: Int, $lastSeriesId: Int) {
    getFeed(lastLogId: $lastLogId, lastSeriesId: $lastSeriesId) {
      ok
      error
      logs {
        id
        photoSize
        text
        categories {
          name
        }
        totalLiked
        series {
          title
          id
        }
        imageUrls
        author {
          id
          username
          name
          profileImageUrl
        }
        splace {
          id
          name
          address
          categories {
            name
          }
        }
        isILiked
        createdAt
      }
      series {
        ...SeriesFragement
      }
    }
  }
  ${SERIES_FRAGMENT}
`;

export const GET_SERIES = gql`
  query getSeries($seriesId: Int!) {
    getSeries(seriesId: $seriesId) {
      id
      splace {
        name
      }
      imageUrls
    }
  }
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
        isFollowing
        id
        name
        url
        photologs {
          id
          imageUrls
        }
        profileImageUrl
        profileMessage
        totalFollowers
        totalFollowing
        totalLogsNumber
        username
      }
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query seeFollowers($userId: Int!, $keyword: String, $lastId: Int) {
    seeFollowers(userId: $userId, keyword: $keyword, lastId: $lastId) {
      ok
      error
      followers {
        ...UserFragement
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
        ...UserFragement
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
  mutation unFollowUser($targetId: Int!) {
    unFollowUser(targetId: $targetId) {
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
        ...RoomFragement
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
          ...UserFragement
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
  mutation createChatroom($title: String!, $memberIds: [Int]!) {
    createChatroom(title: $title, memberIds: $memberIds) {
      ok
      error
      chatroom {
        ...RoomFragement
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
          ...UserFragement
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
        ...UserFragement
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
        ...UserFragement
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
        ...FolderFragement
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
        ...FolderFragement
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
        id
        imageUrls
      }
    }
  }
`;
