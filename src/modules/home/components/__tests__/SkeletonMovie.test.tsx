import { render, cleanup } from "@testing-library/react";
import SkeletonMovie from "../SkeletonMovie";

describe("SkeletonMovie", () => {
  afterEach(cleanup);

  it("SkeletonMovie should render without crash", () => {
    const result = render(<SkeletonMovie />);
    const elm = result.container.querySelector(".movie-item-skeleton");
    expect(elm).toBeInTheDocument();
    expect(result).toMatchSnapshot();
  });
});
