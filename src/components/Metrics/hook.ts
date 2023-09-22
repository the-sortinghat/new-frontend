import { useViewContext } from "@contexts/ViewContext";
import { Dimension } from "@model/dimension";
import { CharM, Metrics } from "@model/metrics";

interface Params {
  charM: CharM;
}

export const useMetrics = ({ charM }: Params) => {
  const { selectedElement, setFocusedElement } = useViewContext();

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

  const isGlobalMetric = (metricValue: any) =>
    typeof metricValue !== "object" ||
    Object.values(metricValue).some((val) => typeof val !== "object");

  const getGlobalMetrics = (): {} => {
    const allMetrics = Object.keys(charM).reduce(
      (metrics, dimension) => [...metrics, charM[dimension as Dimension]],
      [] as Metrics[]
    );

    const globalMetrics = {} as { [key: string]: any };

    allMetrics.forEach((metrics) => {
      Object.entries(metrics).forEach(([name, value]) => {
        if (isGlobalMetric(value)) globalMetrics[name] = value;
      });
    });

    return globalMetrics;
  };

  const getSelectedElementMetrics = (): {} => {
    if (!selectedElement) return {};

    const allMetrics = Object.keys(charM).reduce(
      (metrics, dimension) => [...metrics, charM[dimension as Dimension]],
      [] as Metrics[]
    );

    const specificsMetrics = {} as { [key: string]: any };

    allMetrics.forEach((metrics) => {
      Object.entries(metrics).forEach(([name, value]) => {
        const newName = changeMetricName(name);

        if (!isGlobalMetric(value)) specificsMetrics[newName] = value;
      });
    });

    const { name, type } = selectedElement;

    if (type == undefined) {
      return Object.keys(specificsMetrics);
    }

    return Object.keys(specificsMetrics).reduce(
      (acc, metric) => ({
        ...acc,
        [metric]: specificsMetrics[metric][type][name],
      }),
      {}
    );
  };

  const onMetricClick = ({ name }: { name: string }) =>
    setFocusedElement({ name });

  return {
    globalMetrics: getGlobalMetrics(),
    selectedElementMetrics: getSelectedElementMetrics(),
  };
};
