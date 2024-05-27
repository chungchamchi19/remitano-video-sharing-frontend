import { movieApi } from "..";
import { MovieSession } from "../../types";

describe("movieApi", () => {
  describe("shareMovie", () => {
    it("should return movie", async () => {
      const movie: MovieSession = {
        title: "string",
        description: "string",
        thumbnail: "string",
        youtube_id: "string",
      };
      const response = await movieApi.shareMovie(movie);
      expect(response).toEqual({ status: "success", result: {} });
    });
  });

  describe("getMovies", () => {
    it("should return movies", async () => {
      const response = await movieApi.getMovies(10);
      expect(response).toEqual({ status: "success", result: Array(10).fill({}) });
    });
  });
});

jest.mock("@/modules/base", () => {
  return {
    api: {
      post: jest.fn().mockResolvedValue({ status: "success", result: {} }),
      get: jest.fn().mockResolvedValue({ status: "success", result: Array(10).fill({}) }),
    },
    ApiResponse: jest.fn(),
  };
});
