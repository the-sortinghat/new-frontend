import styles from "./styles.module.css";

const Checkbox: React.FC<{ name: string }> = ({ name }) => {
  return (
    <label className={styles.dimensionCheckbox}>
      {name}
      <input type="checkbox" />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;
