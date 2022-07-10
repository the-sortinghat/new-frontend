const ComplexMetric = ({ name, value }) => {
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

const SimpleMetric = ({ name, value }) => {
  return (
    <p>
      {name}: {value}
    </p>
  );
};

const DisplayMetrics = ({ metrics }) => {
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
