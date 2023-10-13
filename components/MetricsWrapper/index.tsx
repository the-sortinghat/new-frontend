import { Fragment } from "react";
import useMetrics from "@hooks/useMetrics";
import DisplayMetrics from "@components/DisplayMetrics";
import { Metrics, MetricsType, Title } from "./styled";

const MetricsWrapper = ({
  metrics,
  selectedComponents,
  onMetricClick,
}: any) => {
  const { globals, specificsByComponent } = useMetrics(
    metrics,
    selectedComponents
  );

  return (
    <Metrics>
      <Title>Metrics</Title>
      <MetricsType>Global:</MetricsType>
      <DisplayMetrics metrics={globals} onMetricClick={onMetricClick} />

      {specificsByComponent.length > 0 &&
        specificsByComponent.map(({ name, type, metrics }: any) => (
          <Fragment key={`${name}+${type}`}>
            <MetricsType>
              Metrics of the {type} {name}:
            </MetricsType>
            <DisplayMetrics metrics={metrics} />
          </Fragment>
        ))}
    </Metrics>
  );
};

export default MetricsWrapper;
