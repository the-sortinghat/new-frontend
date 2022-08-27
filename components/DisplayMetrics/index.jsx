import styles from "./styles.module.css";

const KeyValueMetric = ({ name, value }) => {
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

const ListMetric = ({ name, value, onMetricClick }) => {
  return (
    <div className={styles.metricContainer}>
      <p className={styles.metricName}>{name}</p>
      <div className={styles.metricValue}>
        {value.map((val, index) => (
          <div key={val} className={styles.metricValueContainer}>
            <a
              className={styles.clickableMetricValue}
              onClick={() => onMetricClick({ name: val })}
            >
              {val}
            </a>
            {index < value.length - 1 && ", "}
          </div>
        ))}
      </div>
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

const DisplayMetrics = ({ metrics, onMetricClick }) => {
  const renderComponentByMetricType = ([metric, value]) => {
    if (Array.isArray(value)) {
      return (
        <ListMetric
          key={metric}
          name={metric}
          value={value}
          onMetricClick={onMetricClick}
        />
      );
    } else if (typeof value === "object") {
      return <KeyValueMetric key={metric} name={metric} value={value} />;
    } else {
      return <SimpleMetric key={metric} name={metric} value={value} />;
    }
  };

  return <>{Object.entries(metrics).map(renderComponentByMetricType)}</>;
};

export default DisplayMetrics;
