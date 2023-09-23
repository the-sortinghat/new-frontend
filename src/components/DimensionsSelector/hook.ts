import { Dimension } from "@model/dimension";

interface Params {
  dimensions: Dimension[];
  onDimensionsUpdate: (newDimensions: Dimension[]) => void;
}

export const useDimensionsSelector = ({
  dimensions,
  onDimensionsUpdate,
}: Params) => {
  const allDimensions = [
    Dimension.SIZE,
    Dimension.DATA_COUPLING,
    Dimension.SYNC_COUPLING,
    Dimension.ASYNC_COUPLING,
  ];

  const isDimensionSelected = (dimension: Dimension) =>
    dimensions.some((dim) => dim === dimension);

  const handleChange = (dimension: Dimension) => {
    const newSelectedDimensions = dimensions.includes(dimension)
      ? dimensions.filter((dim) => dim !== dimension)
      : allDimensions.filter(
          (dim) => isDimensionSelected(dim) || dim === dimension
        );

    onDimensionsUpdate(newSelectedDimensions);
  };

  return {
    allDimensions,
    isDimensionSelected,
    onDimensionSelect: handleChange,
  };
};
