import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { ThemeContext } from "styled-components/native";
import client from "../../apollo";
import { StackGeneratorParamList, themeType, UserType } from "../../types";
import { pixelScaler } from "../../utils";
import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { FOLLOW } from "../../queries";
import useMe from "../../hooks/useMe";
import {
  FollowButton,
  InfoContainer,
  MemberContainer,
  MemberThumbnail,
  TitleContainer,
} from "./StyledComponents";
import Image from "../Image";
import { BldText13, BldText16, RegText13 } from "../Text";

const MemberComponent = ({ user }: { user: UserType }) => {
  const theme = useContext<themeType>(ThemeContext);
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const [isFollowing, setIsfollowing] = useState<boolean>();

  const setIsFollowingFromCache = () => {
    const { isFollowing: following } = client.readFragment({
      id: "User:" + user.id, // The value of the to-do item's cache ID
      fragment: gql`
        fragment myUser on User {
          isFollowing
        }
      `,
    });
    setIsfollowing(following);
  };

  useEffect(() => {
    setIsFollowingFromCache();
  }, []);

  const onCompleted = ({
    followUser: { ok, error },
  }: {
    followUser: {
      ok: boolean;
      error: string;
    };
  }) => {
    // { ok, error }: { ok: boolean; error: string }
    // console.log(user.id);
    if (ok) {
      client.cache.modify({
        id: `User:${user.id}`,
        fields: {
          isFollowing(prev) {
            // console.log(prev);
            return true;
          },
        },
      });
      setIsFollowingFromCache();
    } else {
      Alert.alert("팔로우에 실패하였습니다.");
    }
    // console.log(client.cache)
  };

  const [mutation, { loading, data }] = useMutation(FOLLOW, {
    onCompleted,
  });

  const me = useMe();

  return (
    <MemberContainer
      onPress={() => {
        navigation.push("Profile", { user });
      }}
    >
      <InfoContainer>
        <MemberThumbnail>
          <Image
            source={{
              uri: user.profileImageUrl ?? "",
            }}
            style={{
              width: pixelScaler(32),
              height: pixelScaler(32),
              borderRadius: pixelScaler(32),
            }}
          />
        </MemberThumbnail>
        <TitleContainer>
          <BldText16
            style={{
              color: theme.chatMemberUsername,
              width: pixelScaler(200),
            }}
            numberOfLines={1}
          >
            {user.username}
          </BldText16>
          {user.name ? (
            <RegText13
              style={{
                color: theme.chatMemberName,
              }}
              numberOfLines={1}
            >
              {user.name}
            </RegText13>
          ) : null}
        </TitleContainer>
        {user.id !== me.id && !isFollowing ? (
          <FollowButton
            onPress={() =>
              mutation({
                variables: {
                  targetId: user.id,
                },
              })
            }
          >
            <BldText13 style={{ color: theme.followButtonText }}>
              팔로우
            </BldText13>
          </FollowButton>
        ) : null}
      </InfoContainer>
    </MemberContainer>
  );
};

export default MemberComponent;
