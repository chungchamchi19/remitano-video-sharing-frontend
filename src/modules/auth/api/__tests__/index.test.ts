import { api } from "@/modules/base";
import { authApi } from "..";

describe("authApi", () => {
  describe("login", () => {
    it("should call api.post with correct params", async () => {
      authApi.login("email", "password");
      expect(api.post).toBeCalledWith("/api/auth/login", { email: "email", password: "password" });
    });
  });

  describe("logout", () => {
    it("should call api.post with correct params", async () => {
      authApi.logout();
      expect(api.post).toBeCalledWith("/api/auth/logout", {});
    });
  });
});

jest.mock("@/modules/base", () => {
  let cacheApi: any;
  if (!cacheApi) {
    cacheApi = {
      post: jest.fn(),
    };
  }
  return {
    api: cacheApi,
  };
});
