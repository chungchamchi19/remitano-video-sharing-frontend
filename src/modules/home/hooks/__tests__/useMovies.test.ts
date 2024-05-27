import { renderHook, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { useMovies } from "../useMovies";
import { movieApi } from "../../api";
import { getYoutubeVideoId } from "../../utils";

describe("useMovies", () => {
  describe("shareMovie", () => {
    it("should add shared movie to current list movies when getYoutubeVideoInfo and shareMovie call successfully", async () => {
      jest.mocked(getYoutubeVideoId).mockImplementation(() => "1");
      jest.mocked(movieApi.getYoutubeVideoInfo).mockResolvedValue({
        items: [
          {
            snippet: {
              title: "string",
              description: "string",
              thumbnails: {
                standard: {
                  url: "string",
                },
              },
            },
          },
        ],
      } as any);
      jest.mocked(movieApi.shareMovie).mockResolvedValue({
        status: "success",
        result: { id: 1 },
      } as any);
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
      });
      expect(result.current.movies).toEqual([{ id: 1 }]);
      expect(toast).toBeCalledWith("Share successfully", {
        type: "success",
      });
    });

    it("should not share movie when shareMovie api returns failure", async () => {
      jest.mocked(movieApi.getYoutubeVideoInfo).mockResolvedValue({
        items: [
          {
            snippet: {
              title: "string",
              description: "string",
              thumbnails: {
                standard: {
                  url: "string",
                },
              },
            },
          },
        ],
      } as any);
      movieApi.shareMovie = jest.fn().mockResolvedValue({
        success: false,
      });
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
      });
      expect(result.current.movies).toEqual([]);
    });

    it("should not share movie when getYoutubeVideoInfo return failure", async () => {
      jest.mocked(movieApi.getYoutubeVideoInfo).mockResolvedValue({
        item: null,
      } as any);
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
      });
      expect(result.current.movies).toEqual([]);
      expect(toast).toBeCalledWith("Invalid Youtube link", {
        type: "error",
      });
    });

    it("should not share movie when getYoutubeVideoId return failure", async () => {
      jest.mocked(getYoutubeVideoId).mockImplementation(() => "");
      jest.mocked(movieApi.getYoutubeVideoInfo).mockResolvedValue({
        items: [
          {
            snippet: {
              title: "string",
              description: "string",
              thumbnails: {
                standard: {
                  url: "string",
                },
              },
            },
          },
        ],
      } as any);
      movieApi.shareMovie = jest.fn().mockResolvedValue({
        success: false,
      });
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.shareMovie("https://www.youtube.com/watch?v=");
      });
      expect(result.current.movies).toEqual([]);
      expect(toast).toBeCalledWith("Invalid Youtube link", {
        type: "error",
      });
    });

    it("should show toast when shareMovie return status fail", async () => {
      jest.mocked(getYoutubeVideoId).mockImplementation(() => "1");
      jest.mocked(movieApi.getYoutubeVideoInfo).mockRejectedValue({
        items: [
          {
            snippet: {
              title: "string",
              description: "string",
              thumbnails: {
                standard: {
                  url: "string",
                },
              },
            },
          },
        ],
      });
      movieApi.shareMovie = jest.fn().mockRejectedValue({
        success: false,
      });
      const { result } = renderHook(() => useMovies());
      await act(async () => {
        await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
      });
      expect(result.current.movies).toEqual([]);
      expect(toast).toBeCalled();
    });
  });

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
