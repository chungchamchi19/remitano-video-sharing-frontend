import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { authApi } from "../../api";
import { useRouter } from "next/navigation";

describe("useAuth", () => {
  it("should init with default state", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current).toBeTruthy();
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(result.current.login).toBeInstanceOf(Function);
    expect(result.current.user).toBeNull();
    expect(result.current.logout).toBeInstanceOf(Function);
  });

  it("login should return user and loading falsy when login successfully", async () => {
    authApi.login = jest.fn().mockResolvedValue({
      status: "success",
      result: { id: 1 },
    });
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login("test@gmail.com", "123456");
    });
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(result.current.user).toEqual({ id: 1 });
  });

  it("login should return null user when login fail", async () => {
    authApi.login = jest.fn().mockResolvedValue({
      success: false,
    });
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.login("test@gmail.com", "123456");
    });
    expect(result.current.loading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(result.current.user).toBeNull();
  });

  it("logout should remove current user", async () => {
    const { result } = renderHook(() => useAuth());
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.user).toEqual(null);
    expect(useRouter().push).toBeCalledWith("/");
  });
});

jest.mock("../../api", () => {
  return {
    authApi: {
      login: jest.fn(),
      logout: jest.fn(),
    },
  };
});

jest.mock("next/navigation", () => {
  let cacheUseRouter: any;
  const useRouter = () => {
    if (!cacheUseRouter) {
      cacheUseRouter = {
        push: jest.fn(),
      };
    }
    return cacheUseRouter;
  }
  return {
    useRouter,
    usePathname: () => "/",
  };
});