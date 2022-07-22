import styles from "./styles.module.css";

const ComplexMetric = ({ name, value }) => {
  return (
    <div className={styles.metricContainer}>
      <p className={styles.metricName}>{name}</p>
      <ul className={styles.metricValue}>
        {Object.entries(value).map(([key, val]) => (
          <li key={key}>{`${key}: ${val}`}</li>
        ))}
      </ul>
    </div>
  );
};

const SimpleMetric = ({ name, value }) => {
  return (
    <div className={styles.metricContainer}>
      <p className={styles.metricName}>{name}</p>
      <p className={styles.metricValue}>{value}</p>
    </div>
  );
};

const DisplayMetrics = ({ metrics }) => {
  return (
    <>
      {Object.entries(metrics).map(([metric, value]) =>
        typeof value === "object" ? (
          <ComplexMetric key={metric} name={metric} value={value} />
        ) : (
          <SimpleMetric key={metric} name={metric} value={value} />
        )
      )}
    </>
  );
};

export default DisplayMetrics;
