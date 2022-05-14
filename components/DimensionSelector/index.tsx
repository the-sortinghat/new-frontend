import { ChangeEvent } from "react";
import styles from "@/components/DimensionSelector/styles.module.css";
import { Dimension, Dimensions } from "@/types/dimensions";
import Checkbox from "@/components/Checkbox";

type Props = {
  dimensions: Dimensions;
  updateDimensions: (arg: Dimensions) => void;
};

const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;

const DimensionSelector: React.FC<Props> = ({
  dimensions,
  updateDimensions,
}) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    selected: Dimension
  ) => {
    const mapPreviousSelectedDimensions = {
      [SIZE]: "",
      [DATA_COUPLING]: "",
      [SYNC_COUPLING]: "",
      [ASYNC_COUPLING]: "",
    };
    dimensions.forEach((dim) => (mapPreviousSelectedDimensions[dim] = dim));

    const positionByDimension = {
      [SIZE]: 0,
      [DATA_COUPLING]: 1,
      [SYNC_COUPLING]: 2,
      [ASYNC_COUPLING]: 3,
    };
    const newList = Object.keys(mapPreviousSelectedDimensions).reduce(
      (acc, key) => [...acc, mapPreviousSelectedDimensions[key as Dimension]],
      [] as string[]
    );
    newList[positionByDimension[selected]] = event.target.checked
      ? selected
      : "";

    updateDimensions(newList.filter((elem) => elem !== "") as Dimension[]);
  };

  return (
    <div className={styles.dimensions}>
      <p>Dimensions: </p>
      <Checkbox name="Size" onChange={(e) => handleChange(e, Dimension.SIZE)} />
      <Checkbox
        name="Data coupling"
        onChange={(e) => handleChange(e, Dimension.DATA_COUPLING)}
      />
      <Checkbox
        name="Sync coupling"
        onChange={(e) => handleChange(e, Dimension.SYNC_COUPLING)}
      />
      <Checkbox
        name="Async coupling"
        onChange={(e) => handleChange(e, Dimension.ASYNC_COUPLING)}
      />
    </div>
  );
};

export default DimensionSelector;
