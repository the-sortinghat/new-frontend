import { SystemMetrics } from "@/types/system";
import styles from "@/components/MetricsWrapper/styles.module.css";

type Props = {
  metrics: SystemMetrics;
  selectedComponents?: any;
};

type SplitMetricsReturn = {
  globals: { [key: string]: string };
  specifics: { [key: string]: {} };
};

type DisplayMetricsProps = {
  metrics: { [key: string]: any };
};

type FilterMetricsParams = {
  metrics: { [key: string]: any };
  name: string;
  type: string;
};

type SelectedComponent = {
  type: string;
  name: string;
};

const changeMetricName = (metricName: string): string => {
  let newName = metricName;
  const target = ["a given component", "each component"].find((op) =>
    metricName.includes(op)
  );

  if (target) newName = metricName.replaceAll(target, "it");
  else if (metricName.includes("per component"))
    newName = metricName.replaceAll("per component", "");

  return newName;
};

const splitMetricsIntoGlobalsAndSpecifics = (
  metrics: SystemMetrics
): SplitMetricsReturn => {
  const metricsByDimension = [
    metrics["Size"],
    metrics["Data source coupling"],
    metrics["Synchronous coupling"],
    metrics["Asynchronous coupling"],
  ];

  const globals: { [key: string]: any } = {};
  const specifics: { [key: string]: any } = {};

  metricsByDimension.forEach((metricsSet) => {
    Object.entries(metricsSet).forEach(([name, value]) => {
      const newName = changeMetricName(name);
      const isSpecific =
        typeof value === "object" &&
        Object.values(value).every((val) => typeof val === "object");

      if (isSpecific) {
        specifics[newName] = value;
      } else {
        globals[newName] = value;
      }
    });
  });

  return { globals, specifics };
};

const getComponentMetrics = ({ metrics, name, type }: FilterMetricsParams) => {
  const pluralType = type + "s";

  return Object.keys(metrics).reduce((acc, metric) => {
    const componentExists = Object.keys(metrics[metric][pluralType]).find(
      (key) => key === name
    );

    if (componentExists) {
      return {
        ...acc,
        [metric]: metrics[metric][pluralType][name],
      };
    }

    return acc;
  }, {});
};

const DisplayMetrics = ({ metrics }: DisplayMetricsProps) => {
  return (
    <>
      {Object.entries(metrics).map(([metric, value]) => {
        if (typeof value === "object") {
          return (
            <div key={metric}>
              <p>{metric}:</p>
              <ul key={metric}>
                {Object.entries(value as {}).map(([key, val]) => (
                  <li key={key}>{`${key}: ${val}`}</li>
                ))}
              </ul>
            </div>
          );
        }

        return (
          <p key={metric}>
            {metric}: {value}
          </p>
        );
      })}
    </>
  );
};

const MetricsWrapper = ({ metrics, selectedComponents }: Props) => {
  const { globals, specifics } = splitMetricsIntoGlobalsAndSpecifics(metrics);

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <h4>Global:</h4>
      <DisplayMetrics metrics={globals} />

      {selectedComponents.length > 0 ? (
        selectedComponents.map(({ type, name }: SelectedComponent) => (
          <div key={`${type}+${name}`}>
            <h4>
              Metrics of the {type} {name}:
            </h4>
            <DisplayMetrics
              metrics={getComponentMetrics({
                metrics: specifics,
                name,
                type,
              })}
            />
          </div>
        ))
      ) : (
        <p>Select a component to see its metrics.</p>
      )}
    </div>
  );
};

export default MetricsWrapper;
