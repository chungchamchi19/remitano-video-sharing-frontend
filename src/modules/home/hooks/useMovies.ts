"use client";

import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { movieApi } from "../api";
import { getYoutubeVideoId } from "../utils";
import { Movie, MovieSession } from "../types";

type Period = {
  page?: number;
  limited?: boolean;
  pageSize?: number;
  refresh?: boolean;
  loadMore?: boolean;
};

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [period, setPeriod] = useState({
    page: 0,
    limited: false,
    pageSize: 20,
    refresh: false,
    loadMore: false,
  });
  const [isSharing, setIsSharing] = useState(false);

  const getMovies = useCallback(async (param: Period) => {
    try {
      setPeriod((preState) => ({
        ...preState,
        ...param
      }));
      const lastMovieId = movies[movies.length - 1]?.id;
      const lastMovieIdParam = param.refresh ? undefined : lastMovieId;
      const response = await movieApi.getMovies(period.pageSize, lastMovieIdParam);
      if (response.status ==="success" && response.result) {
        setMovies(preState => preState.concat(response.result || []));
        setPeriod((preState) => ({
          ...preState,
          loadMore: false,
          refresh: false,
          limited: (response.result?.length || 0) < period.pageSize,
        }));
      } else {
        setPeriod((preState) => ({
          ...preState,
          loadMore: false,
          refresh: false,
        }));
      }
    } catch (error) {
      setPeriod((preState) => ({
        ...preState,
        loadMore: false,
        refresh: false,
        limited: true,
      }));
    }
  }, [movies, period.pageSize]);

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
      setMovies([response.result, ...movies]);
      return;
    }
    toast(response.message, {
      type: "error",
    });
  }, [movies]);

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
          createVideo(videoBody);
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
    movies,
    period,
    getMovies,
    shareMovie,
    isSharing,
    setMovies,
  };
};
