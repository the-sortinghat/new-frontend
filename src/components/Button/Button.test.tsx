import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should render loading spinner when loading prop is true", () => {
    render(<Button loading>My button</Button>);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.queryByText("My button")).not.toBeInTheDocument();
  });

  it("should render button children when loading prop is false", () => {
    render(<Button>My button</Button>);

    expect(screen.getByText("My button")).toBeInTheDocument();
    expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
  });
});
