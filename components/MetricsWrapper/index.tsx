import useMetrics from "@hooks/useMetrics";
import DisplayMetrics from "@components/DisplayMetrics";
import styles from "./styles.module.css";

const MetricsWrapper = ({
  metrics,
  selectedComponents,
  onMetricClick,
}: any) => {
  const { globals, specificsByComponent } = useMetrics(
    metrics,
    selectedComponents
  );

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <h4>Global:</h4>
      <DisplayMetrics metrics={globals} onMetricClick={onMetricClick} />

      {specificsByComponent.length > 0 &&
        specificsByComponent.map(({ name, type, metrics }: any) => (
          <div key={`${name}+${type}`}>
            <h4>
              Metrics of the {type} {name}:
            </h4>
            <DisplayMetrics metrics={metrics} />
          </div>
        ))}
    </div>
  );
};

export default MetricsWrapper;
