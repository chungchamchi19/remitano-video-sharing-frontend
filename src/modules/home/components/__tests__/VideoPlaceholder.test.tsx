import { render, cleanup } from "@testing-library/react";
import VideoPlaceholder from "../VideoPlaceholder";

describe("VideoPlaceholder", () => {
  afterEach(cleanup);

  it("VideoPlaceholder should render without crash", () => {
    const result = render(
      <VideoPlaceholder
        thumbnail={"https://thumnail.png"}
        handleClick={() => {}}
      />
    );
    const elm = result.container.querySelector(".video-placeholder");
    expect(elm).toBeInTheDocument();
    const img = result.container.querySelector("img");
    expect(img).toHaveAttribute(
      "src",
      "https://thumnail.png"
    );
  });

  it('should render correct VideoPlaceholder', () => {
    const element = render( <VideoPlaceholder
      thumbnail={"https://thumnail.png"}
      handleClick={() => {}}
    />)
    expect(element).toMatchSnapshot();
  });
});
