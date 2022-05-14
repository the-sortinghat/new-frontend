import { ChangeEvent } from "react";
import styles from "@/components/DimensionSelector/styles.module.css";
import { Dimension, Dimensions } from "@/types/dimensions";
import Checkbox from "@/components/Checkbox";

type Props = {
  dimensions: Dimensions;
  updateDimensions: (arg: Dimensions) => void;
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
