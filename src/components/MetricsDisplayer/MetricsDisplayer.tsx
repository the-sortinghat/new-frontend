import {
  Clickable,
  ClickableWrapper,
  ListItem,
  MetricContainer,
  MetricName,
  MetricValue,
  MetricValueList,
  MetricValueWrapper,
} from "./styled";

type OnMetricClickFunction = (payload: { name: string }) => void;

interface Props {
  metrics: {};
  onMetricsClick: OnMetricClickFunction;
}

const KeyValueMetric = ({ value }: { value: {} }) => {
  return (
    <MetricValueList>
      {Object.entries(value).map(([key, val]) => (
        <ListItem key={key}>{`${key}: ${val}`}</ListItem>
      ))}
    </MetricValueList>
  );
};

const ListMetric = ({
  value,
  onMetricClick,
}: {
  value: any[];
  onMetricClick: OnMetricClickFunction;
}) => {
  return (
    <MetricValueWrapper>
      {value.map((val: any, index: number) => (
        <ClickableWrapper key={val}>
          <Clickable onClick={() => onMetricClick({ name: val })}>
            {val}
          </Clickable>
          {index < value.length - 1 && ", "}
        </ClickableWrapper>
      ))}
    </MetricValueWrapper>
  );
};

const SimpleMetric = ({ value }: { value: any }) => {
  return <MetricValue>{value}</MetricValue>;
};

export const MetricsDisplayer = ({ metrics, onMetricsClick }: Props) => {
  const renderAccordingToMetricValueType = ([metric, value]: [string, any]) => {
    let valueComponent: JSX.Element;

    if (Array.isArray(value)) {
      valueComponent = (
        <ListMetric value={value} onMetricClick={onMetricsClick} />
      );
    } else if (typeof value === "object") {
      valueComponent = <KeyValueMetric value={value} />;
    } else {
      valueComponent = <SimpleMetric value={value} />;
    }

    return (
      <MetricContainer key={metric}>
        <MetricName>{metric}</MetricName>
        {valueComponent}
      </MetricContainer>
    );
  };

  return <>{Object.entries(metrics).map(renderAccordingToMetricValueType)}</>;
};
