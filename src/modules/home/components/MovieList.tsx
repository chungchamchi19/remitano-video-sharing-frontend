import React, { memo, useEffect, useMemo } from "react";
import MovieItem from "./MovieItem";
import SkeletonMovie from "./SkeletonMovie";
import { useMovies } from "../hooks/useMovies";
import { Button } from "@/modules/base";
import { useAuthContext } from "@/modules/auth";
import { useSocket } from "@/modules/base/hooks/useSocket";
import { toast } from "react-toastify";
import { Movie } from "../types";
import Image from "next/image";

const fakeMovies = [1, 2, 3, 4, 5];

const VideoNotification = ({ movie }: { movie: Movie }) => {
  return (
    <div className="flex">
      <Image src={movie?.thumbnail} className="w-[80px] h-[80px] mr-12 rounded-medium" alt="" width={80} height={80} />
      <div className="flex flex-col">
        <span className="font-medium text-12">{movie?.title}</span>
        <span className="font-regular text-12">
          Shared by: <span className="font-medium">{movie?.user?.email}</span>
        </span>
      </div>
    </div>
  );
};

const MovieList = () => {
  const { movies, getMovies, period, setMovies } = useMovies();
  const { loading } = useAuthContext();
  const { isConnected, subscribe, unsubscribe } = useSocket();

  useEffect(() => {
    getMovies({ refresh: true });
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }
    subscribe("share-movie", listenShareMovieWS);
    return () => {
      unsubscribe("share-movie", listenShareMovieWS);
    };
  }, [isConnected]);

  const listenShareMovieWS = (data: any) => {
    setMovies((prev) => {
      return [data, ...prev];
    });
    toast(<VideoNotification movie={data} />, {
      type: "info",
      icon: false,
    });
  };

  const isShowLoadMore = useMemo(() => {
    return !period.refresh && !period.loadMore && !period.limited && movies.length > 0;
  }, [movies.length, period.limited, period.loadMore, period.refresh]);

  const isShowPlaceholder = useMemo(() => {
    return (period.refresh && movies.length === 0) || loading;
  }, [loading, movies.length, period.refresh]);

  return (
    <div className="movie-list-container pt-[32px]">
      {isShowPlaceholder ? fakeMovies.map((item) => <SkeletonMovie key={item} />) : movies.map((movie) => <MovieItem movie={movie} key={movie.id} />)}
      {isShowLoadMore && (
        <div className="btn-loadmore-wrapper flex items-center justify-center mt-24">
          <Button
            isLoading={period.loadMore}
            className="w-[150px] h-[40px] btn-loadmore"
            label="Load more"
            onClick={() => {
              getMovies({ loadMore: true });
            }}
          />
        </div>
      )}
      {period.limited && movies.length === 0 && <div className="w-full flex justify-center items-center">No videos have been shared yet</div>}
    </div>
  );
};

export default memo(MovieList);
