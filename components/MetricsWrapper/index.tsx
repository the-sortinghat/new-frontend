import { useState } from "react";
import { Dimension, Dimensions } from "@/types/dimensions";
import { Module, Service, SystemMetrics } from "@/types/system";
import styles from "@/components/MetricsWrapper/styles.module.css";
import Select from "@/components/Select";

type Props = {
  metrics: SystemMetrics;
  dimensions: Dimensions;
  components: { modules: Module[]; services: Service[] };
};

type ComponentType = "modules" | "services";

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

const filterMetrics = (metrics: {}, name: string, type: ComponentType) => {
  return Object.keys(metrics).reduce((acc, metric) => {
    const componentExists = Object.keys(metrics[metric as keyof {}][type]).find(
      (key) => key === name
    );

    if (componentExists) {
      return {
        ...acc,
        [metric]: metrics[metric as keyof {}][type][name],
      };
    }

    return acc;
  }, {});
};

const MetricsFilterOptions: React.FC<{
  componentType: ComponentType;
  setComponentType: (newType: ComponentType) => void;
  components: { modules: Module[]; services: Service[] };
  setComponentName: (newName: string) => void;
}> = ({ componentType, setComponentType, components, setComponentName }) => {
  return (
    <>
      <fieldset>
        <legend>Select the component type:</legend>
        <label>
          <input
            type="radio"
            name="component_type"
            value="modules"
            defaultChecked
            onClick={(e) =>
              setComponentType(e.currentTarget.value as ComponentType)
            }
          />
          Module
        </label>
        <label>
          <input
            type="radio"
            name="component_type"
            value="services"
            onClick={(e) =>
              setComponentType(e.currentTarget.value as ComponentType)
            }
          />
          Service
        </label>
      </fieldset>

      <fieldset>
        <legend>
          Select the {componentType === "services" ? "service" : "module"}:
        </legend>
        <Select
          name="Search service"
          options={
            componentType === "services"
              ? components.services.map((s) => s.name)
              : components.modules.map((s) => s.name)
          }
          placeholder="Search service"
          onChange={(e) => setComponentName(e.target.value)}
        />
      </fieldset>
    </>
  );
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
  components,
}) => {
  const [componentType, setComponentType] = useState<ComponentType>("modules");
  const [componentName, setComponentName] = useState("");
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
  const filteredMetrics = filterMetrics(
    perComponentMetrics,
    componentName,
    componentType
  );

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      <DisplayMetrics metrics={simpleMetrics} />

      <MetricsFilterOptions
        componentType={componentType}
        components={components}
        setComponentType={setComponentType}
        setComponentName={setComponentName}
      />

      <DisplayMetrics metrics={filteredMetrics} />
    </div>
  );
};

export default MetricsWrapper;
