import { api, DEFAULT_HEADERS, SERVICE_TYPES } from "../api";
import qs from "querystringify";

const mockResponse = (status: number, json: any) => {
  return { status, json: () => json };
};

describe("api", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    it("should return data when call get", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "get",
        headers: DEFAULT_HEADERS,
      };
      const response = { data: "data" };
      global.fetch = jest.fn().mockResolvedValue(mockResponse(200, response));
      const result = await api.get(endpoint, params);
      expect(fetch).toHaveBeenCalledWith(SERVICE_TYPES.GATEWAY_URL + endpoint + qs.stringify(params ? params : {}, true), options);
      expect(result).toEqual(response);
    });

    it("should return error when response success but status is unauthorized", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "get",
        headers: DEFAULT_HEADERS,
      };
      const response = { error: "unauthorized" };
      global.fetch = jest.fn().mockResolvedValue(mockResponse(401, response));
      try {
        await api.get(endpoint, params);
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it("should return error when response success but status is greater than 300", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "get",
        headers: DEFAULT_HEADERS,
      };
      const response = { error: "unauthorized" };
      global.fetch = jest.fn().mockResolvedValue(mockResponse(301, response));
      try {
        await api.get(endpoint, params);
      } catch (error) {
        expect(error).toEqual(response);
      }
    });

    it("should return error when call get", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "get",
        headers: DEFAULT_HEADERS,
      };
      const response = { error: "message" };
      global.fetch = jest.fn().mockRejectedValue(mockResponse(400, response));
      try {
        await api.get(endpoint, params);
      } catch (error) {
        expect((error as { status: number }).status).toEqual(400);
      }
    });
  });

  describe("post", () => {
    it("should return data when call post", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "post",
        body: JSON.stringify(params),
        headers: DEFAULT_HEADERS,
      };
      const response = { data: "data" };
      global.fetch = jest.fn().mockResolvedValue(mockResponse(200, response));
      const result = await api.post(endpoint, params);
      expect(fetch).toHaveBeenCalledWith(SERVICE_TYPES.GATEWAY_URL + endpoint, options);
      expect(result).toEqual(response);
    });

    it("should return error when call post", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "post",
        body: JSON.stringify(params),
        headers: DEFAULT_HEADERS,
      };
      const response = { error: "message" };
      global.fetch = jest.fn().mockRejectedValue(mockResponse(500, response));
      try {
        await api.post(endpoint, params);
      } catch (error) {
        expect((error as { status: number}).status).toEqual(500);
      }
      expect(fetch).toHaveBeenCalledWith(SERVICE_TYPES.GATEWAY_URL + endpoint, options);
    });
  });

  describe("put", () => {
    it("should return data when call put", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "put",
        body: JSON.stringify(params),
        headers: {
          ...DEFAULT_HEADERS,
          "Content-Type": "application/json",
        },
      };
      const response = { data: "data" };
      global.fetch = jest.fn().mockResolvedValue(mockResponse(200, response));
      const result = await api.put(endpoint, params);
      expect(result).toEqual(response);
      expect(fetch).toHaveBeenCalledWith(SERVICE_TYPES.GATEWAY_URL + endpoint, options);
    });
  });

  describe("delete", () => {
    it("should return data when call delete", async () => {
      const endpoint = "/test";
      const params = {};
      const options = {
        method: "delete",
        body: JSON.stringify(params),
        headers: {
          ...DEFAULT_HEADERS,
          "Content-Type": "application/json",
        },
      };
      const response = { data: "data" };
      global.fetch = jest.fn().mockResolvedValue(mockResponse(200, response));
      const result = await api.delete(endpoint, params);
      expect(result).toEqual(response);
      expect(fetch).toHaveBeenCalledWith(SERVICE_TYPES.GATEWAY_URL + endpoint, options);
    });
  });
});
