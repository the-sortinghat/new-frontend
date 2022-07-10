import DisplayMetrics from "../DisplayMetrics";
import styles from "./styles.module.css";

const changeMetricName = (metricName) => {
  let newName = metricName;
  const target = ["a given component", "each component"].find((op) =>
    metricName.includes(op)
  );

  if (target) newName = metricName.replaceAll(target, "it");
  else if (metricName.includes("per component"))
    newName = metricName.replaceAll("per component", "");

  return newName;
};

const splitMetricsIntoGlobalsAndSpecifics = (metrics) => {
  const metricsByDimension = [
    metrics["Size"],
    metrics["Data source coupling"],
    metrics["Synchronous coupling"],
    metrics["Asynchronous coupling"],
  ];

  const globals = {};
  const specifics = {};

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

const getComponentMetrics = ({ metrics, name, type }) => {
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

const NoComponentSelected = () => {
  return <p>Select a component to see its metrics.</p>;
};

const SelectedComponentMetrics = ({ name, type, specificMetrics }) => {
  const metrics = getComponentMetrics({
    metrics: specificMetrics,
    name,
    type,
  });

  return (
    <div>
      <h4>
        Metrics of the {type} {name}:
      </h4>
      <DisplayMetrics metrics={metrics} />
    </div>
  );
};

const MetricsWrapper = ({ metrics, selectedComponents }) => {
  const { globals, specifics } = splitMetricsIntoGlobalsAndSpecifics(metrics);

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <h4>Global:</h4>
      <DisplayMetrics metrics={globals} />

      {selectedComponents.length > 0 ? (
        selectedComponents.map(({ type, name }) => (
          <SelectedComponentMetrics
            key={`${type}+${name}`}
            name={name}
            type={type}
            specificMetrics={specifics}
          />
        ))
      ) : (
        <NoComponentSelected />
      )}
    </div>
  );
};

export default MetricsWrapper;
