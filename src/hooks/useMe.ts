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
    console.log(data);
    if (data?.getMe?.ok && !data.getMe.ok) {
      logUserOut();
    }
  }, [data]);
  return data?.getMe?.me;
};

export default useMe;
