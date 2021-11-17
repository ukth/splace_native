import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  makeVar,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import {
  getMainDefinition,
  offsetLimitPagination,
} from "@apollo/client/utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { createUploadLink } from "apollo-upload-client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Alert } from "react-native";
import { ProgressContext } from "./contexts/Progress";
import { useContext } from "react";
import { PhotologType, RoomType, SeriesType, UserType } from "./types";
import { API_URL, TOKEN } from "./constants";

export const isLoggedInVar = makeVar<boolean>(false);
export const tokenVar = makeVar<string | null>("");
export const userIdVar = makeVar<number | null>(null);
export const menualCheckedVar = makeVar<number>(0);

export const logUserIn = async (token: string, userId: number) => {
  await AsyncStorage.setItem(TOKEN, token);
  // console.log("input:", userId, token);
  isLoggedInVar(true);
  tokenVar(token);
  userIdVar(userId);
  // console.log("logged in!");
  // console.log(tokenVar());
  // console.log(userIdVar());
  // console.log(isLoggedInVar());
};

export const logUserOut = async () => {
  await AsyncStorage.setItem(TOKEN, "");
  // console.log("log out!");
  isLoggedInVar(false);
  tokenVar("");
  userIdVar(null);
  // console.log(isLoggedInVar(), tokenVar(), userIdVar());
};

const httpLink = createHttpLink({
  uri: "https://" + API_URL + "/graphql",
});

// const uploadHttpLink = createUploadLink({
//   uri: "http://localhost:4000/graphql",
// });

const wsLink = new WebSocketLink({
  uri: "ws://" + API_URL + "/graphql",
  options: {
    connectionParams: () => ({
      token: tokenVar(),
      // token: AsyncStorage.getItem(TOKEN),
    }),
  },
});

const authLink = setContext((_, { headers }) => {
  // console.log("set context!", tokenVar());
  return {
    headers: {
      ...headers,
      token: tokenVar(),
      // token: AsyncStorage.getItem(TOKEN),
    },
  };
});

const onErrorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(`GraphQL Error`, graphQLErrors);
    Alert.alert("네트워크 에러 발생, 관리자에게 문의 부탁드립니다");
  }
  if (networkError) {
    console.log("Network Error", networkError);
    Alert.alert("네트워크 연결을 확인해주세요");
  }
});

// export const cache = new InMemoryCache({
//   typePolicies: {
//     Query: {
//       fields: {
//         seeFeed: offsetLimitPagination(),
//       },
//     },
//   },
// });

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getFeed: {
          keyArgs: false,
          merge(existing, incoming) {
            if (!existing) {
              return incoming;
            }
            if (
              !incoming ||
              !incoming.ok ||
              existing?.logs
                ?.map((log: any) => log.__ref)
                ?.includes(incoming.logs[0]?.__ref)
            ) {
              return existing;
            }
            return {
              ...existing,
              logs: [...existing.logs, ...incoming.logs],
              series: [...existing.series, ...incoming.series],
            };
          },
        },
        getMyRooms: {
          keyArgs: false,
          merge(existing, incoming) {
            // console.log(existing);
            // console.log("existing", existing);
            // console.log("incoming", incoming);

            if (!existing) {
              return incoming;
            }
            if (
              !incoming ||
              !incoming.ok ||
              existing?.myRooms
                ?.map((room: any) => room.__ref)
                ?.includes(incoming.myRooms[0]?.__ref)
            ) {
              return existing;
            }

            return {
              ...existing,
              myRooms: [...existing.myRooms, ...incoming.myRooms],
            };
          },
        },
        seeFollowers: {
          keyArgs: ["keyword", "userId"],
          merge(existing, incoming) {
            if (!existing) {
              return incoming;
            }
            if (
              !incoming ||
              !incoming.ok ||
              existing?.followers
                ?.map((follower: any) => follower.__ref)
                ?.includes(incoming.followers[0]?.__ref)
            ) {
              return existing;
            }

            return {
              ...existing,
              followers: [...existing.followers, ...incoming.followers],
            };
          },
        },
        getUserLogs: {
          keyArgs: ["userId"],
          merge(existing, incoming) {
            // console.log(existing);

            if (!existing) {
              return incoming;
            }
            if (!incoming || !incoming.ok) {
              return existing;
            }

            for (let i = 0; i < incoming.logs.length; i++) {
              for (let j = 0; j < existing.logs.length; j++) {
                if (
                  incoming.logs[i] &&
                  existing.logs[j] &&
                  incoming.logs[i].__ref === existing.logs[j].__ref
                ) {
                  return existing;
                }
              }
            }
            // console.log("not included");
            // console.log("existing,\n", existing, "\n\nincoming\n", incoming);

            return {
              ...incoming,
              logs: [...existing.logs, ...incoming.logs],
            };
          },
        },
        getUserSeries: {
          keyArgs: ["userId"],
          merge(existing, incoming) {
            if (!existing) {
              return incoming;
            }
            if (
              !incoming ||
              !incoming.ok ||
              existing?.series
                ?.map((seriesElement: any) => seriesElement.__ref)
                ?.includes(incoming.series[0]?.__ref)
            ) {
              return existing;
            }

            return {
              ...existing,
              series: [...existing.series, ...incoming.series],
            };
          },
        },

        getLogsBySplace: {
          keyArgs: ["splaceId", "orderBy"],
          merge(existing, incoming) {
            if (!existing) {
              return incoming;
            }
            if (
              !incoming ||
              !incoming.ok ||
              existing?.logs
                ?.map((log: any) => log.__ref)
                ?.includes(incoming.logs[0]?.__ref)
            ) {
              return existing;
            }
            return {
              ...existing,
              logs: [...existing.logs, ...incoming.logs],
            };
          },
        },
      },
    },
    Mutation: {
      fields: {
        getBigCategories: {
          keyArgs: ["tagId"],
          merge(existing, incoming) {
            // console.log("existing\n", existing);
            // console.log("incoming\n", incoming);
            return existing;
          },
        },
      },
    },
  },
});

const httpLinks = authLink.concat(onErrorLink).concat(httpLink);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinks
);

const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
