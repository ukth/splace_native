import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar, logUserIn, logUserOut } from "../apollo";
import { UserType } from "../types";

const GET_ME = gql`
  query getMe {
    getMe {
      ok
      me {
        id
        username
        name
        profileImageUrl
      }
    }
  }
`;

const useMe = () => {
  const loggedIn = isLoggedInVar();
  const { data } = useQuery(GET_ME, { skip: !loggedIn });
  useEffect(() => {
    if (data?.me?.getMe === null) {
      logUserOut();
    }
  }, [data]);
  return data?.getMe?.me;
};

export default useMe;
