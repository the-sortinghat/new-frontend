import { useViewContext } from "@contexts/ViewContext";
import { Dimension } from "@model/dimension";
import { fireEvent, render, screen } from "@testing-library/react";
import { DimensionsSelector } from "./DimensionsSelector";

jest.mock("@contexts/ViewContext/hook");

describe("DimensionsSelector", () => {
  beforeEach(() => {
    (useViewContext as jest.Mock).mockReturnValue({
      selectedDimensions: [Dimension.DATA_COUPLING],
      setSelectedDimensions: jest.fn((_: Dimension[]) => {}),
    });
  });

  it("should keep the dimensions ordered when selecting multiple dimensions", () => {
    const { setSelectedDimensions } = useViewContext();

    render(<DimensionsSelector />);

    fireEvent.click(screen.getByText("Size"));

    expect(setSelectedDimensions).toHaveBeenCalledWith([
      Dimension.SIZE,
      Dimension.DATA_COUPLING,
    ]);
  });
});
