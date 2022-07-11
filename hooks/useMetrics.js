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

const getComponentMetrics = (specifics, { name, type }) => {
  const pluralType = type + "s";

  return Object.keys(specifics).reduce((acc, metric) => {
    const componentExists = Object.keys(specifics[metric][pluralType]).find(
      (key) => key === name
    );

    if (componentExists) {
      return {
        ...acc,
        [metric]: specifics[metric][pluralType][name],
      };
    }

    return acc;
  }, {});
};

const useMetrics = (metrics, selectedComponents) => {
  const { globals, specifics } = splitMetricsIntoGlobalsAndSpecifics(metrics);
  const specificMetricsBySelectedComponents = selectedComponents.map(
    ({ name, type }) => ({
      name,
      type,
      metrics: getComponentMetrics(specifics, { name, type }),
    })
  );

  return { globals, specificsByComponent: specificMetricsBySelectedComponents };
};

export default useMetrics;
