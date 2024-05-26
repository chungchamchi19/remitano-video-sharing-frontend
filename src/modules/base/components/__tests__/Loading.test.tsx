import { render, cleanup, fireEvent } from "@testing-library/react";
import { Loading } from "../Loading";

describe("Loading", () => {
  afterEach(cleanup);

  it("should render correct Loading", () => {
    const element = render(<Loading />);
    expect(element).toMatchSnapshot();
  });
});
