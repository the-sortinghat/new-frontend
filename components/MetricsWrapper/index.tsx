import { Dimension, Dimensions } from "@/types/dimensions";
import { SystemMetrics } from "@/types/system";
import styles from "@/components/MetricsWrapper/styles.module.css";

type Props = {
  metrics: SystemMetrics;
  dimensions: Dimensions;
};

const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;

const MetricsWrapper: React.FC<Props> = ({ metrics, dimensions }) => {
  const isAnyDimensionSelected = dimensions.length > 0;

  if (!isAnyDimensionSelected) {
    return (
      <div className={styles.metrics}>
        <h2>Metrics</h2>
        <p>Select a dimension to see the metrics.</p>
      </div>
    );
  }

  const isNotEmpty = Object.keys(metrics).length > 0;
  const metricsByDimension = {
    [SIZE]: metrics["Size"],
    [DATA_COUPLING]: metrics["Data source coupling"],
    [SYNC_COUPLING]: metrics["Synchronous coupling"],
    [ASYNC_COUPLING]: metrics["Asynchronous coupling"],
  };
  const dimensionsToCorrectName = {
    [SIZE]: "Size",
    [DATA_COUPLING]: "Data source coupling",
    [SYNC_COUPLING]: "Synchronous coupling",
    [ASYNC_COUPLING]: "Asynchronous coupling",
  };
  const metricsThatWillBeDisplayed = dimensions.reduce(
    (acc, dim) => ({ ...acc, [dim]: metricsByDimension[dim] }),
    {}
  );

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      {isNotEmpty &&
        Object.entries(metricsThatWillBeDisplayed).map(
          ([dimension, metrics]) => (
            <div key={dimension}>
              <h3>{dimensionsToCorrectName[dimension as Dimension]}</h3>
              {Object.entries(metrics as {}).map(([metric, value]) => {
                if (value instanceof Object) {
                  return (
                    <div key={metric}>
                      <p>{metric}:</p>
                      <ul>
                        {Object.entries(value as {}).map(
                          ([component, value]) => (
                            <li key={component}>{`${component}: ${value}`}</li>
                          )
                        )}
                      </ul>
                    </div>
                  );
                }

                return <p key={metric}>{`${metric}: ${value}`}</p>;
              })}
            </div>
          )
        )}
    </div>
  );
};

export default MetricsWrapper;
