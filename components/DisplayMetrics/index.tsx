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

const KeyValueMetric = ({ name, value }: any) => {
  return (
    <MetricContainer>
      <MetricName>{name}</MetricName>
      <MetricValueList>
        {Object.entries(value).map(([key, val]) => (
          <ListItem key={key}>{`${key}: ${val}`}</ListItem>
        ))}
      </MetricValueList>
    </MetricContainer>
  );
};

const ListMetric = ({ name, value, onMetricClick }: any) => {
  return (
    <MetricContainer>
      <MetricName>{name}</MetricName>
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
    </MetricContainer>
  );
};

const SimpleMetric = ({ name, value }: any) => {
  return (
    <MetricContainer>
      <MetricName>{name}</MetricName>
      <MetricValue>{value}</MetricValue>
    </MetricContainer>
  );
};

const DisplayMetrics = ({ metrics, onMetricClick }: any) => {
  const renderComponentByMetricType = ([metric, value]: any) => {
    if (Array.isArray(value)) {
      return (
        <ListMetric
          key={metric}
          name={metric}
          value={value}
          onMetricClick={onMetricClick}
        />
      );
    } else if (typeof value === "object") {
      return <KeyValueMetric key={metric} name={metric} value={value} />;
    } else {
      return <SimpleMetric key={metric} name={metric} value={value} />;
    }
  };

  return <>{Object.entries(metrics).map(renderComponentByMetricType)}</>;
};

export default DisplayMetrics;
