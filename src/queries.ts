import { gql } from "@apollo/client";

export const USER_FRAGMENT = gql`
  fragment UserFragement on User {
    id
    username
    name
    profileImageUrl
  }
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
      id
      username
      profileImageUrl
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
        hashtags {
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
          hashtags {
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
        id
        title
        members {
          isFollowing
          ...UserFragement
        }
        lastMessage {
          id
          text
          createdAt
        }
        chatroomReaded {
          id
          user {
            ...UserFragement
          }
          readedAt
        }
        updatedAt
        createdAt
      }
    }
  }
  ${USER_FRAGMENT}
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
