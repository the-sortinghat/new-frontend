import styles from "./styles.module.css";

const Checkbox = ({ name, ...rest }) => {
  return (
    <label className={styles.dimensionCheckbox}>
      {name}
      <input type="checkbox" {...rest} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;
