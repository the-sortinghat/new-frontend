const changeMetricName = (metricName: string) => {
  let newName = metricName;
  const target = ["a given component", "each component"].find((op) =>
    metricName.includes(op)
  );

  if (target) newName = metricName.replaceAll(target, "it");
  else if (metricName.includes("per component"))
    newName = metricName.replaceAll("per component", "");

  return newName;
};

const splitMetricsIntoGlobalsAndSpecifics = (metrics: any) => {
  const metricsByDimension = [
    metrics["Size"],
    metrics["Data source coupling"],
    metrics["Synchronous coupling"],
    metrics["Asynchronous coupling"],
  ];

  const globals: any = {};
  const specifics: any = {};

  metricsByDimension.forEach((metricsSet) => {
    Object.entries(metricsSet).forEach(([name, value]: any) => {
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

const getComponentMetrics = (specifics: any, { name, type }: any) => {
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

const useMetrics = (metrics: any, selectedComponents: any) => {
  const { globals, specifics } = splitMetricsIntoGlobalsAndSpecifics(metrics);
  const specificMetricsBySelectedComponents = selectedComponents.map(
    ({ name, type }: any) => ({
      name,
      type,
      metrics: getComponentMetrics(specifics, { name, type }),
    })
  );

  return { globals, specificsByComponent: specificMetricsBySelectedComponents };
};

export default useMetrics;
