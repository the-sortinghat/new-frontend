import styles from "./styles.module.css";

const Button = ({ loading = false, text, ...rest }) => {
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
