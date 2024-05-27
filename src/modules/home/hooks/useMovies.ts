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
        toast("Get movies failed", {
          type: "error",
        });
      }
    } catch (error) {
      setPeriod((preState) => ({
        ...preState,
        loadMore: false,
        refresh: false,
        limited: true,
      }));
      toast("Get movies failed", {
        type: "error",
      });
    }
  }, [movies, period.pageSize]);

  return {
    movies,
    period,
    getMovies,
    setMovies,
  };
};
