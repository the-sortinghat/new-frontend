import React from "react";
import Checkbox from "@components/Checkbox";
import { Dimension } from "@common/dimension";
import styles from "./styles.module.css";

const DimensionSelector = ({ dimensions, updateDimensions }: any) => {
  const allDimensions = [
    { name: "Size", dimension: Dimension.SIZE },
    { name: "Data coupling", dimension: Dimension.DATA_COUPLING },
    { name: "Sync coupling", dimension: Dimension.SYNC_COUPLING },
    { name: "Async coupling", dimension: Dimension.ASYNC_COUPLING },
  ];
  const selectedDimensions: any = allDimensions.reduce(
    (acc, { dimension }) => ({
      ...acc,
      [dimension]: dimensions.some((dim: any) => dim === dimension),
    }),
    {}
  );
  const handleChange = (dimension: any) => {
    selectedDimensions[dimension] = !selectedDimensions[dimension];

    const newList = Object.keys(selectedDimensions).filter(
      (dimension) => selectedDimensions[dimension]
    );

    updateDimensions(newList);
  };

  return (
    <div className={styles.dimensions}>
      <p>Dimensions: </p>
      {allDimensions.map(({ name, dimension }) => (
        <Checkbox
          key={name}
          name={name}
          checked={selectedDimensions[dimension]}
          onChange={() => handleChange(dimension)}
        />
      ))}
    </div>
  );
};

export default DimensionSelector;
