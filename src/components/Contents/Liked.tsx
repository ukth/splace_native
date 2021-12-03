import { useMutation } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import React, { useContext, useEffect, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { theme } from "../../../theme";
import client from "../../apollo";
import { LIKE_PHOTOLOG, UNLIKE_PHOTOLOG } from "../../queries";
import { PhotologType, ThemeType } from "../../types";
import { convertNumber, pixelScaler } from "../../utils";
import { Icon } from "../Icon";
import { RegText13 } from "../Text";

const Liked = ({ item }: { item: PhotologType }) => {
  const [liked, setLiked] = useState<boolean>(item.isILiked);
  const [totalLiked, setTotalLiked] = useState(item.totalLiked);

  useEffect(() => {
    setLiked(item.isILiked);
  }, [item.isILiked]);

  useEffect(() => {
    setTotalLiked(item.totalLiked);
  }, [item.totalLiked]);

  const onLikeCompleted = async (data: any) => {
    const {
      likePhotolog: { ok, error },
    } = data;
    if (ok) {
      client.cache.modify({
        id: `Photolog:${item.id}`,
        fields: {
          isILiked(prev) {
            return true;
          },
          totalLiked(prev) {
            return prev + 1;
          },
        },
      });
    } else {
      Alert.alert("failed to like content!\n", error);
      setLiked(false);
    }
  };

  const onUnlikeCompleted = async (data: any) => {
    const {
      unlikePhotolog: { ok, error },
    } = data;
    if (ok) {
      client.cache.modify({
        id: `Photolog:${item.id}`,
        fields: {
          isILiked(prev) {
            return false;
          },
          totalLiked(prev) {
            return prev - 1;
          },
        },
      });
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

  const theme = useContext<ThemeType>(ThemeContext);

  // console.log("Like rendered!");

  return (
    <LikeContainer>
      <RegText13
        style={{ marginRight: pixelScaler(3), marginLeft: pixelScaler(5) }}
      >
        {item.author.isMe ? totalLiked : convertNumber(totalLiked)}
      </RegText13>
      <TouchableOpacity
        hitSlop={{
          top: pixelScaler(6),
          bottom: pixelScaler(6),
          left: pixelScaler(6),
          right: pixelScaler(6),
        }}
        onPress={() => {
          // console.log("pressed!");
          if (liked) {
            if (!loading_unlike) {
              setTotalLiked(totalLiked - 1);
              ex_unlike({
                variables: {
                  photologId: item.id,
                },
              });
              setLiked(false);
            }
          } else {
            if (!loading_like) {
              setTotalLiked(totalLiked + 1);
              ex_like({
                variables: {
                  photologId: item.id,
                },
              });
              setLiked(true);
            }
          }
        }}
      >
        {/* <Icon
          name={liked ? "heart_colorfill" : "empty_heart"}
          style={{ width: pixelScaler(20.6), height: pixelScaler(18.6) }}
        /> */}
        <Ionicons
          name={liked ? "heart" : "heart-outline"}
          size={pixelScaler(23)}
          color={liked ? theme.themeBackground : "black"}
        />
      </TouchableOpacity>
    </LikeContainer>
  );
};

export default Liked;
