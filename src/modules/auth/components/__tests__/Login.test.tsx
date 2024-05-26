import { render, cleanup, fireEvent } from "@testing-library/react";
import Login from "../Login";
import { flushPromises } from "@/modules/base";
import { useAuth } from "../../hooks/useAuth";

describe("Login", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  it("should render correct Login", () => {
    const login = render(<Login />);
    expect(login).toMatchSnapshot();
  });

  it("Login component should render without crash", () => {
    const result = render(<Login />);
    const container = result.container;
    const elm = container.querySelector(".login-container");
    const inputEmail = container.querySelector('input[type="email"]');
    const inputPassword = container.querySelector('input[type="password"]');
    const btnSubmit = container.querySelector('button[type="submit"]');
    expect(elm).toBeInTheDocument();
    expect(inputEmail).toBeInTheDocument();
    expect(inputPassword).toBeInTheDocument();
    expect(btnSubmit).toBeInTheDocument();
  });

  it("Button Login/Register is disabled when email or password empty", () => {
    const result = render(<Login />);
    const btnSubmit = result.container.querySelector('button[type="submit"]');
    expect(btnSubmit).toBeDisabled();
  });

  it("Button Login/Register is disabled when email empty and password not empty", () => {
    const { inputPassword, btnSubmit } = renderDOM();
    fireEvent.change(inputPassword, { target: { value: "test_password" } });
    expect(btnSubmit).toBeDisabled();
  });

  it("Button Login/Register is disabled when email not empty and password empty", () => {
    const { inputEmail, btnSubmit } = renderDOM();
    fireEvent.change(inputEmail, { target: { value: "test_email@gmail.com" } });
    expect(btnSubmit).toBeDisabled();
  });

  it("Button Login/Register is enabled when email not empty and password not empty", () => {
    const { inputEmail, inputPassword, btnSubmit } = renderDOM();
    fireEvent.change(inputEmail, { target: { value: "test_email@gmail.com" } });
    fireEvent.change(inputPassword, { target: { value: "test_password" } });
    expect(btnSubmit).not.toBeDisabled();
  });

  it("Button Login/Register should call login function when click",async () => {
    const { form } = renderDOM();
    form?.dispatchEvent(new Event("submit", { bubbles: true }));
    await flushPromises()
    expect(useAuth().login).toBeCalledTimes(1);
  });
});

const renderDOM = () => {
  const result = render(<Login />);
  const container = result.container;
  const inputEmail = container.querySelector('input[type="email"]') as Element;
  const inputPassword = container.querySelector('input[type="password"]') as Element;
  const btnSubmit = container.querySelector('button[type="submit"]') as HTMLButtonElement;
  const form = container.querySelector("form") as Element;
  return {
    inputEmail,
    inputPassword,
    btnSubmit,
    form,
  };
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}));

jest.mock("../../hooks/useAuth", () => {
  let _cache: any;
  const useAuth = () => {
    if (!_cache) {
      _cache = {
        login: jest.fn(),
      };
    }
    return _cache;
  };
  return {
    useAuth,
  };
});