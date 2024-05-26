import { render, cleanup, screen } from "@testing-library/react";
import { AuthProvider } from "../AuthContext";
import React from "react";
import { setToken } from "../../../base/services/api";
import { useRouter } from "next/navigation";

describe("AuthProvider", () => {
  afterEach(() => {
    cleanup();
    jest.clearAllMocks();
  });

  it("AuthContext should render without crash", async () => {
    render(
      <AuthProvider>
        <div data-testid="root"></div>
      </AuthProvider>
    );
    expect(await screen.findByTestId("root")).toBeInTheDocument();
  });

  it("AuthContext should redirect to login when user not found", async () => {
    render(
      <AuthProvider>
        <div data-testid="root"></div>
      </AuthProvider>
    );
    expect(useRouter().push).toBeCalled();
    expect(useRouter().push).toBeCalledWith("/");
  });

  it("AuthContext should set current user when user found", async () => {
    localStorage.setItem("user", JSON.stringify({ token: "token" }));
    const setCurrentUser = jest.fn();
    const useStateMock: any = (initState: any) => [initState, setCurrentUser];
    jest.spyOn(React, "useState").mockImplementation(useStateMock);
    render(
      <AuthProvider>
        <div data-testid="root"></div>
      </AuthProvider>
    );
    expect(useRouter().push).not.toBeCalled();
    expect(setCurrentUser).toHaveBeenCalledWith({ token: "token" });
    expect(setCurrentUser).toHaveBeenCalledWith(false);
    expect(setToken).toBeCalledTimes(1);
  });
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
  }
});

jest.mock("../../../base/services/api", () => {
  return {
    setToken: jest.fn()
  }
})