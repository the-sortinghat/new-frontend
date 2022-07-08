type DisplayMetricsProps = {
  metrics: { [key: string]: any };
};

type ComplexMetricProps = {
  name: string;
  value: { [key: string]: any };
};

type SimpleMetricProps = {
  name: string;
  value: string;
};

const ComplexMetric = ({ name, value }: ComplexMetricProps) => {
  return (
    <div>
      <p>{name}:</p>
      <ul>
        {Object.entries(value).map(([key, val]) => (
          <li key={key}>{`${key}: ${val}`}</li>
        ))}
      </ul>
    </div>
  );
};

const SimpleMetric = ({ name, value }: SimpleMetricProps) => {
  return (
    <p>
      {name}: {value}
    </p>
  );
};

const DisplayMetrics = ({ metrics }: DisplayMetricsProps) => {
  return (
    <>
      {Object.entries(metrics).map(([metric, value]) =>
        typeof value === "object" ? (
          <ComplexMetric key={metric} name={metric} value={value} />
        ) : (
          <SimpleMetric key={metric} name={metric} value={value} />
        )
      )}
    </>
  );
};

export default DisplayMetrics;
