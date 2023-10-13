import React, { InputHTMLAttributes } from "react";
import styles from "./styles.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Checkbox = ({ name, ...rest }: CheckboxProps) => {
  return (
    <label className={styles.dimensionCheckbox}>
      {name}
      <input type="checkbox" {...rest} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;
