import useMetrics from "../../hooks/useMetrics";
import DisplayMetrics from "../DisplayMetrics";
import styles from "./styles.module.css";

const MetricsWrapper = ({ metrics, selectedComponents }) => {
  const { globals, specificsByComponent } = useMetrics(
    metrics,
    selectedComponents
  );

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <h4>Global:</h4>
      <DisplayMetrics metrics={globals} />

      {specificsByComponent.length > 0 ? (
        specificsByComponent.map(({ name, type, metrics }) => (
          <div key={`${name}+${type}`}>
            <h4>
              Metrics of the {type} {name}:
            </h4>
            <DisplayMetrics metrics={metrics} />
          </div>
        ))
      ) : (
        <p>Select a component to see its metrics.</p>
      )}
    </div>
  );
};

export default MetricsWrapper;
