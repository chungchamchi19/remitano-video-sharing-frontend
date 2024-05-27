import { renderHook, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { useMovies } from "../useMovies";
import { movieApi } from "../../api";
import { getYoutubeVideoId } from "../../utils";

describe("useMovies", () => {
  describe("getMovies", () => {
    it("should return movies when getMovies api calls successfully", async () => {
      jest.mocked(movieApi.getMovies).mockResolvedValue({
        status: "success",
        result: Array(10).fill({}),
      } as any);
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.getMovies({ page: 10 });
      });
      expect(result.current.movies).toEqual(Array(10).fill({}));
    });

    it("should show toast when getMovies api return status fail", async () => {
      jest.mocked(movieApi.getMovies).mockRejectedValue({
        success: false,
      });
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.getMovies({ page: 10 });
      });
      expect(toast).toBeCalled();
    });

    it("should has not lastMovieIdParam when getMovies", async () => {
      jest.mocked(movieApi.getMovies).mockRejectedValue({
        status: "success",
        result: [{ id: 1 }],
      });
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.getMovies({ refresh: true });
      });
      expect(movieApi.getMovies).toBeCalledWith(20, undefined);
    });
  });
});

jest.mock("../../utils/helpers");

jest.mock("react-toastify", () => ({
  toast: jest.fn(),
}));

jest.mock("../../utils/helpers", () => ({
  getYoutubeVideoId: jest.fn(),
}));

jest.mock("../../api", () => ({
  movieApi: {
    shareMovie: jest.fn(),
    getMovies: jest.fn(),
    getYoutubeVideoInfo: jest.fn(),
  },
}));
