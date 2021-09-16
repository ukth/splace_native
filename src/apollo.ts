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

export const isLoggedInVar = makeVar<boolean>(false);
export const tokenVar = makeVar<string | null>("");
export const userIdVar = makeVar<number | null>(null);

const TOKEN = "token";

export const logUserIn = async (token: string, userId: number) => {
  // await AsyncStorage.setItem(TOKEN, token);
  console.log("input:", userId, token);
  isLoggedInVar(true);
  tokenVar(token);
  userIdVar(userId);
  console.log("logged in!");
  console.log(tokenVar());
  console.log(userIdVar());
  console.log(isLoggedInVar());
};

export const logUserOut = async () => {
  // await AsyncStorage.setItem(TOKEN, "");
  console.log("log out!");
  isLoggedInVar(false);
  tokenVar("a");
  userIdVar(null);
  console.log(isLoggedInVar(), tokenVar(), userIdVar());
};

const httpLink = createHttpLink({
  uri: "http://3.37.199.95:5000/graphql",
});

// const uploadHttpLink = createUploadLink({
//   uri: "http://localhost:4000/graphql",
// });

const wsLink = new WebSocketLink({
  uri: "ws://3.37.199.95:5000/graphql",
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
            // console.log(existing);

            if (!existing) {
              return incoming;
            }
            if (!incoming || !incoming.ok) {
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
            if (!incoming || !incoming.ok) {
              return existing;
            }

            return {
              ...existing,
              myRooms: [...existing.myRooms, ...incoming.myRooms],
            };
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
