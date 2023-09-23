import { MetricsDisplayer } from "@components/MetricsDisplayer/MetricsDisplayer";
import { CharM } from "@model/metrics";
import { useMetrics } from "./hook";
import { MetricsType, MetricsWrapper, Title } from "./styled";

interface Props {
  charM: CharM;
}

export const Metrics = (props: Props) => {
  const { globalMetrics, selectedElementMetrics } = useMetrics(props);

  return (
    <MetricsWrapper>
      <Title>Metrics</Title>
      <MetricsType>Global:</MetricsType>
      {/* <MetricsDisplayer metrics={globalMetrics} /> */}
    </MetricsWrapper>
  );
};
