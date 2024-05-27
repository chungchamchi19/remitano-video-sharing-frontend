"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { movieApi } from "../api";
import { getYoutubeVideoId } from "../utils";
import { MovieSession } from "../types";

export const useShareMovie = () => {
  const [isSharing, setIsSharing] = useState(false);

  const getShareVideoBody = async (videoId: string) => {
    const youtubeInfo = await movieApi.getYoutubeVideoInfo(videoId);
    if (youtubeInfo && youtubeInfo.items && youtubeInfo.items.length > 0) {
      const title = youtubeInfo.items[0].snippet?.title ?? "Movie title";
      const description = youtubeInfo.items[0].snippet?.description ?? "Movie description";
      const thumbnail = youtubeInfo.items[0].snippet?.thumbnails?.standard?.url ?? "";
      return {
        isValid: true,
        body: {
          title,
          description,
          thumbnail,
          youtube_id: videoId,
        },
      };
    }
    return {
      isValid: false,
    };
  };

  const createVideo = useCallback(async (videoBody: MovieSession) => {
    const response = await movieApi.shareMovie(videoBody);
    setIsSharing(false);
    if (response.status === "success" && response.result) {
      toast("Share successfully", {
        type: "success",
      });
      return;
    }
    toast(response.message, {
      type: "error",
    });
  }, []);

  const shareMovie = useCallback(
    async (youtubeLink: string) => {
      try {
        const videoId = getYoutubeVideoId(youtubeLink);
        if (!videoId) {
          toast("Invalid Youtube link", {
            type: "error",
          });
          return;
        }
        setIsSharing(true);
        const { isValid, body: videoBody } = await getShareVideoBody(videoId);
        if (isValid && videoBody) {
          await createVideo(videoBody);
        } else {
          toast("Invalid Youtube link", {
            type: "error",
          });
          setIsSharing(false);
        }
      } catch (error: any) {
        toast(error.message, {
          type: "error",
        });
        setIsSharing(false);
      }
    },
    [createVideo]
  );

  return {
    shareMovie,
    isSharing,
  };
};
