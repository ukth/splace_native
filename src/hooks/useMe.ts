import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar, logUserIn, logUserOut } from "../apollo";
import { UserType } from "../types";
import { GET_ME } from "../queries";

const useMe = () => {
  const loggedIn = isLoggedInVar();
  const { data, refetch } = useQuery(GET_ME, { skip: !loggedIn });

  useEffect(() => {
    (async () => await refetch())();
    if (data?.getMe?.ok && !data.getMe.ok) {
      logUserOut();
    }
  }, [data]);
  return data?.getMe?.me;
};

export default useMe;
