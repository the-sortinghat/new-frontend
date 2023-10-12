import styles from "./styles.module.css";
import React, { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  text?: string;
}
const Button = ({ loading = false, text, ...rest }: ButtonProps) => {
  const loadingSpinner = (
    <div className={styles.spinnerContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );

  return (
    <button className={styles.button} disabled={loading} {...rest}>
      {loading ? loadingSpinner : text}
    </button>
  );
};

export default Button;
