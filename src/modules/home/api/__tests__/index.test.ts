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
});

jest.mock("@/modules/base", () => {
  return {
    api: {
      post: jest.fn().mockResolvedValue({ status: "success", result: {} }),
    },
    ApiResponse: jest.fn(),
  };
});
