import { render, cleanup, fireEvent, waitFor } from "@testing-library/react";
import Header from "../Header";
 //@ts-ignore
 global.setImmediate = jest.useRealTimers;

describe("Header", () => {
  afterEach(cleanup);
 
  it("should render correct Header", () => {
    const header = render(<Header />);
    expect(header).toMatchSnapshot();
  });
});

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => "/",
}));