import React, { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { isLoggedInVar, logUserIn, logUserOut } from "../apollo";
import { UserType } from "../types";
import { GET_BIGCATEGORIES } from "../queries";

const useBigCategories = () => {
  const { data, refetch } = useQuery(GET_BIGCATEGORIES);

  useEffect(() => {
    (async () => await refetch())();
    // console.log(data);
  }, [data]);
  return data?.getBigCategories?.bigCategories;
};

export default useBigCategories;
