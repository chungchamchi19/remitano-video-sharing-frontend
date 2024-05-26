import { renderHook, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { useMovies } from "../useMovies";
import { movieApi } from "../../api";
import { getYoutubeVideoId } from "../../utils";

describe("useMovies", () => {
  it("useMovies should work", () => {
    const { result } = renderHook(() => useMovies());
    expect(result.current).toBeTruthy();
    expect(result.current.movies).not.toBeUndefined();
    expect(result.current.shareMovie).toBeInstanceOf(Function);
  });

  it("shareMovie should work when getYoutubeVideoInfo and shareMovie apis success", async () => {
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

  it("shareMovie should work when getYoutubeVideoInfo api success and shareMovie api fail", async () => {
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

  it("shareMovie should work when getYoutubeVideoInfo api fail", async () => {
    jest.mocked(movieApi.getYoutubeVideoInfo).mockResolvedValue({
      item: null,
    } as any);
    const { result } = renderHook(() =>  useMovies());
    await act(async () => {
      await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
    });
    expect(result.current.movies).toEqual([]);
    expect(toast).toBeCalledWith("Invalid Youtube link", {
      type: "error",
    });
  });

  it("shareMovie should work when getYoutubeVideoId fail", async () => {
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

  it("should show toast and setLoading is false when shareMovie fail", async () => {
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
    getYoutubeVideoInfo: jest.fn(),
  },
}));
