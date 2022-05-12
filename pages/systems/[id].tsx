import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import Checkbox from "../../components/Checkbox";
import Header from "../../components/Header";
import { getSystemById } from "../../services/system_data";
import styles from "../../styles/SystemPage.module.css";
import { Dimension, Dimensions } from "../../types/dimensions";
import { System } from "../../types/system";

const Graph = dynamic(() => import("../../components/Graph"), {
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
      <h2>Dimensions</h2>
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
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { id } = router.query;
      getSystemById(id as string).then((sys) => setSystem(sys));
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

        <div className={styles.grid}>
          <DimensionSelector
            dimensions={dimensions}
            updateDimensions={setDimensions}
          />
          <div className={styles.view}>
            <Graph system={system} dimensions={dimensions} />
          </div>
          <div className={styles.metrics}>
            <h2>Metrics</h2>
            <p>Number of system’s components: 5</p>
            <p>Number of services per modules: 1</p>
            <p>Number of services with deployment dependency: 0</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemPage;
