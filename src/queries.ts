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
    unreadCount
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
      readedAt
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
        id
        author {
          id
          username
          profileImageUrl
        }
        title
        photologs {
          id
          imageUrls
        }
        createdAt
      }
    }
  }
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
      isFollowing
      id
      name
      photologs {
        id
        imageUrls
      }
      profileImageUrl
      profileMessage
      totalFollowers
      totalFollowing
      username
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
        unreadCount
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
        unreadCount
        createdAt
        isMine
      }
      readedRecord {
        id
        readedAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const READ_CHATROOM = gql`
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
      unreadCount
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

export const LEAVE_CHATROOM = gql`
  mutation quitChatroom($chatroomId: Int!) {
    quitChatroom(chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const ADD_CHAT_MEMBERS = gql`
  mutation addChatMembers($chatroomId: Int!, $memberIds: [Int]!) {
    addChatMembers(chatroomId: $chatroomId, memberIds: $memberIds) {
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

// export const GET_FOLDER_INFO = gql`
//   query getFolders($lastId: Int) {
//     getFolders(lastId: $lastId) {
//       ok
//       error
//       folders {
//         ...FolderFragement
//       }
//     }
//   }
//   ${FOLDER_FRAGMENT}
// `;
