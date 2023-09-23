import React from "react";
import { useDimensionsSelector } from "./hook";
import { SelectorWrapper } from "./styled";
import { Checkbox } from "@components/Checkbox";
import { useViewContext } from "@contexts/ViewContext";

export const DimensionsSelector = () => {
  const { selectedDimensions, setSelectedDimensions } = useViewContext();
  const { allDimensions, isDimensionSelected, onDimensionSelect } =
    useDimensionsSelector({
      dimensions: selectedDimensions || [],
      onDimensionsUpdate: setSelectedDimensions,
    });

  return (
    <SelectorWrapper>
      Dimensions:
      {allDimensions.map((dimension) => (
        <Checkbox
          key={dimension}
          name={dimension}
          checked={isDimensionSelected(dimension)}
          onChange={() => onDimensionSelect(dimension)}
        />
      ))}
    </SelectorWrapper>
  );
};
