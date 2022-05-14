import { InputHTMLAttributes } from "react";
import styles from "@/components/Checkbox/styles.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ name, ...rest }) => {
  return (
    <label className={styles.dimensionCheckbox}>
      {name}
      <input type="checkbox" {...rest} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default Checkbox;
