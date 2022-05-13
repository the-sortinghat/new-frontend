import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ChangeEvent, Component, useEffect, useState } from "react";
import Checkbox from "../../components/Checkbox";
import Header from "../../components/Header";
import { getSystemById, getSystemMetrics } from "../../services/system_data";
import styles from "../../styles/SystemPage.module.css";
import { Dimension, Dimensions } from "../../types/dimensions";
import { System, SystemMetrics } from "../../types/system";

const Graph = dynamic(() => import("../../components/Graph"), {
  ssr: false,
});
const ImageKey = dynamic(() => import("../../components/ImageKey"), {
  ssr: false,
});

const DimensionSelector: React.FC<{
  dimensions: Dimensions;
  updateDimensions: (Dimensions) => void;
}> = ({ dimensions, updateDimensions }) => {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
    selected: Dimension
  ) => {
    event.target.checked
      ? updateDimensions([selected, ...dimensions])
      : updateDimensions(dimensions.filter((d) => d !== selected));
  };

  return (
    <div className={styles.dimensions}>
      <p>Dimensions: </p>
      <Checkbox name="Size" onChange={(e) => handleChange(e, Dimension.SIZE)} />
      <Checkbox
        name="Data coupling"
        onChange={(e) => handleChange(e, Dimension.DATA_COUPLING)}
      />
      <Checkbox
        name="Sync coupling"
        onChange={(e) => handleChange(e, Dimension.SYNC_COUPLING)}
      />
      <Checkbox
        name="Async coupling"
        onChange={(e) => handleChange(e, Dimension.ASYNC_COUPLING)}
      />
    </div>
  );
};

const MetricsWrapper: React.FC<{
  metrics: SystemMetrics;
  dimensions: Dimensions;
}> = ({ metrics, dimensions }) => {
  const isNotEmpty = Object.keys(metrics).length > 0;
  const metricsByDimension = {
    [Dimension.SIZE]: metrics["Size"],
    [Dimension.DATA_COUPLING]: metrics["Data source coupling"],
    [Dimension.SYNC_COUPLING]: metrics["Synchronous coupling"],
    [Dimension.ASYNC_COUPLING]: metrics["Asynchronous coupling"],
  };
  const metricsThatWillBeDisplayed = dimensions.reduce(
    (acc, dimension) => ({ ...acc, ...metricsByDimension[dimension] }),
    {}
  );

  return (
    <div className={styles.metrics}>
      <h2>Metrics</h2>
      {isNotEmpty &&
        Object.entries(metricsThatWillBeDisplayed).map(([metric, value]) => {
          if (value instanceof Object) {
            return (
              <div key={metric}>
                <p>{metric}:</p>
                <ul>
                  {Object.entries(value as {}).map(([component, value]) => (
                    <li key={component}>{`${component}: ${value}`}</li>
                  ))}
                </ul>
              </div>
            );
          }

          return <p key={metric}>{`${metric}: ${value}`}</p>;
        })}
    </div>
  );
};

const SystemPage: NextPage = () => {
  const [dimensions, setDimensions] = useState<Dimensions>([]);
  const [system, setSystem] = useState<System>({
    id: -1,
    name: "",
    description: "",
    modules: [],
    services: [],
    databases: [],
    databasesUsages: [],
    syncOperations: [],
    asyncOperations: [],
  });
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>(
    {} as SystemMetrics
  );
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      getSystemById(id as string)
        .then((sys) => {
          setSystem(sys);
          return getSystemMetrics(id as string);
        })
        .then((metrics) => setSystemMetrics(metrics));
    }
  }, [router.isReady, router.query]);

  return (
    <div className={styles.container}>
      <Header title={system.name} />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.back()}
          >
            &larr;
          </button>

          <h1 className={styles.title}>{system.name}</h1>
        </div>

        <DimensionSelector
          dimensions={dimensions}
          updateDimensions={setDimensions}
        />

        <div className={styles.grid}>
          <div className={styles.view}>
            <Graph system={system} dimensions={dimensions} />
            <div className={styles.imageKey}>
              <ImageKey />
            </div>
          </div>

          <MetricsWrapper metrics={systemMetrics} dimensions={dimensions} />
        </div>
      </main>
    </div>
  );
};

export default SystemPage;
