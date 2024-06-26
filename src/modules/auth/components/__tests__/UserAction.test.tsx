import { render, cleanup, fireEvent } from "@testing-library/react";
import UserAction from "../UserAction";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";

describe("UserAction", () => {
  afterEach(cleanup);

  it("UserAction should render without crash", () => {
    const result = render(<UserAction />);
    const elm = result.container.querySelector(".user-action-container");
    expect(elm).toBeInTheDocument();
  });

  it("UserAction should show authorized user's email", () => {
    const email = "email_test@gmail.com";
    const result = render(<UserAction email={email} />);
    const elm = result.container.querySelector(".txt-welcome");
    expect(elm).not.toBeNull();
    expect(elm?.textContent).toBe(`Welcome ${email}`);
  });

  it("UserAction should show empty user email when not passing", () => {
    const result = render(<UserAction />);
    const elm = result.container.querySelector(".txt-welcome");
    expect(elm).not.toBeNull();
    expect(elm?.textContent).toBe(`Welcome `);
  });

  it("It calls start logout on button click", () => {
    const result = render(<UserAction />);
    const btn = result.container.querySelector(".btn-logout") as Element;
    fireEvent.click(btn);
    expect(useAuth().logout).toBeCalledTimes(1);
  });

  it("should render correct Login", () => {
    const element = render(<UserAction />);
    expect(element).toMatchSnapshot();
  });

  it("should go to share page when click on share button", () => {
    const { push } = useRouter();
    const result = render(<UserAction />);
    const btn = result.container.querySelector(".btn-share-movie") as Element;
    fireEvent.click(btn);
    expect(push).toBeCalledWith("/share");
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
  };
  return {
    useRouter,
    usePathname: () => "/",
  };
});

jest.mock("../../hooks/useAuth", () => {
  let _cache: any;
  const useAuth = () => {
    if (!_cache) {
      _cache = {
        logout: jest.fn(),
      };
    }
    return _cache;
  };
  return {
    useAuth,
  };
});
