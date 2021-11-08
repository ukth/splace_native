import { useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { LIKE_PHOTOLOG, UNLIKE_PHOTOLOG } from "../../queries";
import { PhotologType } from "../../types";
import { convertNumber, pixelScaler } from "../../utils";
import { Icon } from "../Icon";
import { RegText13 } from "../Text";

const Liked = ({ item }: { item: PhotologType }) => {
  const [liked, setLiked] = useState<boolean>(item.isILiked);

  const onLikeCompleted = async (data: any) => {
    const {
      likePhotolog: { ok, error },
    } = data;

    if (ok) {
      // await logUserIn(token);
      setLiked(true);
    } else {
      Alert.alert("failed to like content!\n", error);
      setLiked(false);
    }
  };

  const onUnlikeCompleted = async (data: any) => {
    const {
      unlikePhotolog: { ok, error },
    } = data;

    // console.log(ok);

    if (ok) {
      setLiked(false);
    } else {
      Alert.alert("failed to unlike content!\n", error);
      setLiked(true);
    }
  };

  const [ex_like, { loading: loading_like }] = useMutation(LIKE_PHOTOLOG, {
    onCompleted: onLikeCompleted,
  });

  const [ex_unlike, { data, loading: loading_unlike }] = useMutation(
    UNLIKE_PHOTOLOG,
    {
      onCompleted: onUnlikeCompleted,
    }
  );

  const LikeContainer = styled.View`
    right: 0;
    flex-direction: row;
    align-items: center;
  `;

  return (
    <LikeContainer>
      <RegText13>
        {convertNumber(
          item.totalLiked +
            (item.isILiked && !liked ? -1 : !item.isILiked && liked ? 1 : 0)
        )}
      </RegText13>
      <TouchableOpacity
        onPress={() => {
          if (liked && !loading_unlike) {
            ex_unlike({
              variables: {
                photologId: item.id,
              },
            });
            setLiked(false);
          } else {
            if (!loading_like) {
              ex_like({
                variables: {
                  photologId: item.id,
                },
              });
            }
            setLiked(true);
          }
        }}
      >
        <Icon
          name={liked ? "heart_colorfill" : "empty_heart"}
          style={{ width: pixelScaler(26), height: pixelScaler(24) }}
        />
      </TouchableOpacity>
    </LikeContainer>
  );
};

export default Liked;
