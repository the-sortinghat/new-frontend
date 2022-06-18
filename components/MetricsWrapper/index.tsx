import { Dimension, Dimensions } from "@/types/dimensions";
import { SystemMetrics } from "@/types/system";
import styles from "@/components/MetricsWrapper/styles.module.css";

type Props = {
  metrics: SystemMetrics;
  dimensions: Dimensions;
  selectedComponents?: any;
};

const processMetrics = (
  metrics: SystemMetrics
): { simpleMetrics: {}; perComponentMetrics: {} } => {
  const { SIZE, DATA_COUPLING, SYNC_COUPLING, ASYNC_COUPLING } = Dimension;
  const metricsByDimension = {
    [SIZE]: metrics["Size"],
    [DATA_COUPLING]: metrics["Data source coupling"],
    [SYNC_COUPLING]: metrics["Synchronous coupling"],
    [ASYNC_COUPLING]: metrics["Asynchronous coupling"],
  };
  const getNewMetricName = (metricName: string): string => {
    let newName = metricName;
    const target = ["a given component", "each component"].find((op) =>
      metricName.includes(op)
    );

    if (target) newName = metricName.replaceAll(target, "it");
    else if (metricName.includes("per component"))
      newName = metricName.replaceAll("per component", "");
    return newName;
  };

  return Object.entries(metricsByDimension).reduce(
    (acc, [dim, metricsSet]) => {
      const subResult = Object.entries(metricsSet).reduce(
        (obj, [metricName, value]) => {
          const newName = getNewMetricName(metricName);
          return typeof value === "object"
            ? {
                simpleMetrics: { ...obj.simpleMetrics },
                perComponentMetrics: {
                  ...obj.perComponentMetrics,
                  [dim]: {
                    ...(obj.perComponentMetrics[dim as keyof {}] as {}),
                    [newName]: value,
                  },
                },
              }
            : {
                simpleMetrics: {
                  ...obj.simpleMetrics,
                  [newName]: value,
                },
                perComponentMetrics: { ...obj.perComponentMetrics },
              };
        },
        { simpleMetrics: {}, perComponentMetrics: {} }
      );

      return {
        simpleMetrics: { ...acc.simpleMetrics, ...subResult.simpleMetrics },
        perComponentMetrics: {
          ...acc.perComponentMetrics,
          ...subResult.perComponentMetrics,
        },
      };
    },
    { simpleMetrics: {}, perComponentMetrics: {} }
  );
};

const filterMetrics = (
  metrics: {},
  name: string,
  type: string,
  dimensions: Dimensions
) => {
  const pluralType = type + "s";
  const filterBySelectedDimensions = Object.keys(metrics).reduce(
    (acc, dim) =>
      dimensions.find((d) => d === dim)
        ? { ...acc, ...(metrics[dim as keyof {}] as {}) }
        : acc,
    {}
  );
  return Object.keys(filterBySelectedDimensions).reduce((acc, metric) => {
    const componentExists = Object.keys(
      filterBySelectedDimensions[metric as keyof {}][pluralType]
    ).find((key) => key === name);

    if (componentExists) {
      return {
        ...acc,
        [metric]:
          filterBySelectedDimensions[metric as keyof {}][pluralType][name],
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
  selectedComponents,
}) => {
  const { simpleMetrics, perComponentMetrics } = processMetrics(metrics);
  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <h4>Global:</h4>
      <DisplayMetrics metrics={simpleMetrics} />

      {selectedComponents.length > 0 ? (
        selectedComponents.map(
          ({ type, name }: { type: string; name: string }) => (
            <div key={`${type}+${name}`}>
              <h4>
                Metrics of the {type} {name}:
              </h4>
              <DisplayMetrics
                metrics={filterMetrics(
                  perComponentMetrics,
                  name,
                  type,
                  dimensions
                )}
              />
            </div>
          )
        )
      ) : (
        <p>Select a component to see its metrics.</p>
      )}
    </div>
  );
};

export default MetricsWrapper;
