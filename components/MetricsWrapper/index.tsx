import { Dimension, Dimensions } from "@/types/dimensions";
import { SystemMetrics } from "@/types/system";
import styles from "@/components/MetricsWrapper/styles.module.css";

type Props = {
  metrics: SystemMetrics;
  dimensions: Dimensions;
  selectedService?: string;
};

const processMetrics = (metrics: SystemMetrics, dimensions: Dimensions) => {
  const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;
  const metricsByDimension = {
    [SIZE]: metrics["Size"],
    [DATA_COUPLING]: metrics["Data source coupling"],
    [SYNC_COUPLING]: metrics["Synchronous coupling"],
    [ASYNC_COUPLING]: metrics["Asynchronous coupling"],
  };

  return dimensions.reduce(
    (acc, dim) => ({
      ...acc,
      ...Object.keys(metricsByDimension[dim]).reduce((obj, metricName) => {
        let newName = metricName;
        const target = ["a given component", "each component"].find((op) =>
          metricName.includes(op)
        );

        if (target) newName = metricName.replaceAll(target, "it");
        else if (metricName.includes("per component"))
          newName = metricName.replaceAll("per component", "");

        return {
          ...obj,
          [newName]: metricsByDimension[dim][metricName as keyof {}],
        };
      }, {}),
    }),
    {}
  );
};

const filterMetrics = (metrics: {}, name: string) => {
  return Object.keys(metrics).reduce((acc, metric) => {
    const componentExists = Object.keys(
      metrics[metric as keyof {}]["services"]
    ).find((key) => key === name);

    if (componentExists) {
      return {
        ...acc,
        [metric]: metrics[metric as keyof {}]["services"][name],
      };
    }

    return acc;
  }, {});
};

const DisplayMetrics: React.FC<{ metrics: {} }> = ({ metrics }) => {
  return (
    <>
      {Object.entries(metrics).map(([metric, value]) => (
        <p key={metric}>{`${metric}: ${value}`}</p>
      ))}
    </>
  );
};

const MetricsWrapper: React.FC<Props> = ({
  metrics,
  dimensions,
  selectedService = "",
}) => {
  const isAnyDimensionSelected = dimensions.length > 0;

  if (!isAnyDimensionSelected) {
    return (
      <div className={styles.metrics}>
        <h2>Metrics</h2>
        <p>Select a dimension to see the metrics.</p>
      </div>
    );
  }

  const allMetrics = processMetrics(metrics, dimensions);

  const perComponentMetrics = Object.keys(allMetrics).reduce(
    (acc, metricName) =>
      typeof allMetrics[metricName as keyof {}] !== "object"
        ? acc
        : { ...acc, [metricName]: allMetrics[metricName as keyof {}] },
    {}
  );
  const simpleMetrics = Object.keys(allMetrics).reduce(
    (acc, metricName) =>
      typeof allMetrics[metricName as keyof {}] === "object"
        ? acc
        : { ...acc, [metricName]: allMetrics[metricName as keyof {}] },
    {}
  );
  const filteredMetrics = filterMetrics(perComponentMetrics, selectedService);

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <DisplayMetrics metrics={simpleMetrics} />

      {selectedService !== "" ? (
        <>
          <p className={styles.specificServiceLabel}>
            Specific metrics of the service {selectedService}:
          </p>
          <DisplayMetrics metrics={filteredMetrics} />
        </>
      ) : (
        <p>Select a service to see more metrics.</p>
      )}
    </div>
  );
};

export default MetricsWrapper;
