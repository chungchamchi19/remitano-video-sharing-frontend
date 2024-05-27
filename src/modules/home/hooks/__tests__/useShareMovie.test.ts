import { renderHook } from "@testing-library/react";
import { movieApi } from "../../api";
import { getYoutubeVideoId } from "../../utils";
import { useShareMovie } from "../useShareMovie";
import { act } from "react-dom/test-utils";
import { toast } from "react-toastify";

describe("useShareMovie", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

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
    const { result } = renderHook(() => useShareMovie());
    await act(async () => {
      await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
    });
    expect(toast).toBeCalledWith("Share successfully", {
      type: "success",
    });
  });

  it("should not share movie when shareMovie api returns failure", async () => {
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
    movieApi.shareMovie = jest.fn().mockRejectedValue({
      success: false,
      message: "Share failed",
    });
    const { result } = renderHook(() => useShareMovie());
    await act(async () => {
      await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
    });
    expect(toast).toBeCalledWith("Share failed", { type: "error" });
  });

  it("should not share movie when getYoutubeVideoInfo return failure", async () => {
    jest.mocked(movieApi.getYoutubeVideoInfo).mockResolvedValue({
      item: null,
    } as any);
    const { result } = renderHook(() => useShareMovie());
    await act(async () => {
      await result.current.shareMovie("https://www.youtube.com/watch?v=mnlo3ntJG98");
    });
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
    const { result } = renderHook(() => useShareMovie());
    await act(async () => {
      await result.current.shareMovie("https://www.youtube.com/watch?v=");
    });
    expect(toast).toBeCalledWith("Invalid Youtube link", {
      type: "error",
    });
  });
});

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
