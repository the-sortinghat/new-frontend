import Checkbox from "@/components/Checkbox";
import styles from "@/components/DimensionSelector/styles.module.css";
import { Dimension } from "@/types/system";

type Props = {
  dimensions: Dimension[];
  updateDimensions: (arg: Dimension[]) => void;
};

const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;

const DimensionSelector = ({ dimensions, updateDimensions }: Props) => {
  const allDimensions = [
    { name: "Size", dimension: SIZE },
    { name: "Data coupling", dimension: DATA_COUPLING },
    { name: "Sync coupling", dimension: SYNC_COUPLING },
    { name: "Async coupling", dimension: ASYNC_COUPLING },
  ];
  const selectedDimensions: { [key: string]: boolean } = allDimensions.reduce(
    (acc, { dimension }) => ({
      ...acc,
      [dimension]: dimensions.some((dim) => dim === dimension),
    }),
    {}
  );

  const handleChange = (dimension: Dimension) => {
    selectedDimensions[dimension] = !selectedDimensions[dimension];

    const newList = Object.keys(selectedDimensions).filter(
      (dimension) => selectedDimensions[dimension]
    );

    updateDimensions(newList as Dimension[]);
  };

  return (
    <div className={styles.dimensions}>
      <p>Dimensions: </p>
      {allDimensions.map(({ name, dimension }) => (
        <Checkbox
          key={name}
          name={name}
          checked={selectedDimensions[dimension]}
          onChange={(_) => handleChange(dimension)}
        />
      ))}
    </div>
  );
};

export default DimensionSelector;
