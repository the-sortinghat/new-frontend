import { Dimension, Dimensions } from "../../types/dimensions";
import { SystemMetrics } from "../../types/system";
import styles from "./styles.module.css";

type Props = {
  metrics: SystemMetrics;
  dimensions: Dimensions;
};

const MetricsWrapper: React.FC<Props> = ({ metrics, dimensions }) => {
  const isNotEmpty = Object.keys(metrics).length > 0;
  const metricsByDimension = {
    [Dimension.SIZE]: metrics["Size"],
    [Dimension.DATA_COUPLING]: metrics["Data source coupling"],
    [Dimension.SYNC_COUPLING]: metrics["Synchronous coupling"],
    [Dimension.ASYNC_COUPLING]: metrics["Asynchronous coupling"],
  };
  const metricsThatWillBeDisplayed = dimensions.reduce(
    (acc, dimension) => ({ ...acc, ...metricsByDimension[dimension] }),
    {}
  );

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      {isNotEmpty &&
        Object.entries(metricsThatWillBeDisplayed).map(([metric, value]) => {
          if (value instanceof Object) {
            return (
              <div key={metric}>
                <p>{metric}:</p>
                <ul>
                  {Object.entries(value as {}).map(([component, value]) => (
                    <li key={component}>{`${component}: ${value}`}</li>
                  ))}
                </ul>
              </div>
            );
          }

          return <p key={metric}>{`${metric}: ${value}`}</p>;
        })}
    </div>
  );
};

export default MetricsWrapper;
