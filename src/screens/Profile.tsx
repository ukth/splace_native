import { useLazyQuery, useQuery } from "@apollo/client";
import { RouteProp } from "@react-navigation/native";
import React from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";
import { GET_PROFILE } from "../queries";
import { StackGeneratorParamList, themeType } from "../types";

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
`;

const UpperProfileContainer = styled.View``;

const Profile = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Profile">;
}) => {
  const user = route.params.user;
  const myProfile = false;

  const onCompleted = () => {};

  const [ex_query, { loading, error, data }] = useLazyQuery(GET_PROFILE, {
    onCompleted,
  });

  return (
    <Container>
      <UpperProfileContainer></UpperProfileContainer>
    </Container>
  );
};

export default Profile;
