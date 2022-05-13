import { ChangeEvent } from "react";
import { Dimension, Dimensions } from "../../types/dimensions";
import Checkbox from "../Checkbox";
import styles from "./styles.module.css";

type Props = {
  dimensions: Dimensions;
  updateDimensions: (Dimensions) => void;
};

const DimensionSelector: React.FC<Props> = ({
  dimensions,
  updateDimensions,
}) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    selected: Dimension
  ) => {
    event.target.checked
      ? updateDimensions([selected, ...dimensions])
      : updateDimensions(dimensions.filter((d) => d !== selected));
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
