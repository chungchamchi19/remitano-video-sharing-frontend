import { renderHook, act } from "@testing-library/react";
import { useInput } from "../";

describe("useInput", () => {
  it("should return default value when init", () => {
    const { result } = renderHook(() => useInput("initValue"));
    expect(result.current).toBeTruthy();
    expect(result.current.value).toBeTruthy();
    expect(result.current.setValue).toBeTruthy();
    expect(result.current.setValue).toBeInstanceOf(Function);
    expect(result.current.handleOnChange).toBeTruthy();
    expect(result.current.handleOnChange).toBeInstanceOf(Function);
    expect(result.current.value).toBe("initValue");
  });

  it("should set new value when call setValue", () => {
    const { result } = renderHook(() => useInput("initValue"));
    act(() => {
      result.current.setValue("newValue");
    });
    expect(result.current.value).toBe("newValue");
  });

  it("should set new value when call handleOnChange", () => {
    const { result } = renderHook(() => useInput("initValue"));
    act(() => {
      const event = {
        target: {
          value: "finalValue",
        },
      } as React.ChangeEvent<HTMLInputElement>;
      event.target.value = "finalValue";
      result.current.handleOnChange(event);
    });
    expect(result.current.value).toBe("finalValue");
  });

  it("should set undefined when call handleOnChange with null", () => {
    const { result } = renderHook(() => useInput("initValue"));
    act(() => {
      result.current.handleOnChange(null);
    });
    expect(result.current.value).toBe(undefined);
  });
});
