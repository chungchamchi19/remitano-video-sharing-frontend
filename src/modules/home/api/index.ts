/* istanbul ignore file */

import { api, ApiResponse } from "@/modules/base";
import { Movie, MovieSession } from "../types";

export const movieApi = {
  shareMovie: async (movie: MovieSession): Promise<ApiResponse<Movie>> => {
    return await api.post("/api/movies", movie);
  },

  getMovies: async (
    pageSize: number,
    lastMovieId?: string,
  ): Promise<ApiResponse<Movie[]>> => {
    return await api.get("/api/public/movies", { lastMovieId, pageSize: pageSize, orderBy: "DESC" });
  },

  getYoutubeVideoInfo: async (
    video_id?: string
  ): Promise<{
    kind: string;
    etag: string;
    items: {
      snippet: {
        title: string;
        description: string;
        thumbnails: {
          standard: {
            url: string;
          };
        };
      };
    }[];
  }> => {
    const googleApiBase = "https://www.googleapis.com/youtube/v3";
    const youtubeApiKey = "AIzaSyBirQgi4eEGZZXR4HG1-O1XOZzyz6gfdgE";
    const requestUrl = `${googleApiBase}/videos?id=${video_id}&key=${youtubeApiKey}&part=snippet`;
    return new Promise(async (resolve, reject) => {
      try {
        const resp = await fetch(requestUrl);
        const data = await resp.json();
        if (data && data.error) {
          reject(data.error);
        } else {
          resolve(data);
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};
