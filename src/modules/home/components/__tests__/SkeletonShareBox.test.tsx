import { render, cleanup } from "@testing-library/react";
import SkeletonShareBox from "../SkeletonShareBox";

describe("SkeletonShareBox", () => {
  afterEach(cleanup);

  it("SkeletonShareBox should render without crash", () => {
    const result = render(<SkeletonShareBox />);
    const elm = result.container.querySelector(".sharebox-container-skeleton");
    expect(elm).toBeInTheDocument();
  });

  it("should render correct SkeletonMovie", () => {
    const element = render(<SkeletonShareBox />);
    expect(element).toMatchSnapshot();
  });
});
