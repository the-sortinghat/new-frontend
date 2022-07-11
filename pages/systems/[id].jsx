import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import DimensionSelector from "../../components/DimensionSelector";
import Header from "../../components/Header";
import MetricsWrapper from "../../components/MetricsWrapper";
import useSystem from "../../hooks/useSystem";
import styles from "../../styles/SystemPage.module.css";

const Graph = dynamic(() => import("../../components/Graph"), { ssr: false });
const ImageKey = dynamic(() => import("../../components/ImageKey"), {
  ssr: false,
});

const PageHeader = ({ router, title }) => {
  return (
    <div className={styles.pageHeader}>
      <button
        type="button"
        className={styles.back}
        onClick={() => router.back()}
      >
        &larr;
      </button>

      <h1 className={styles.title}>{title}</h1>
    </div>
  );
};

const GraphAndMetrics = ({ system, dimensions, metrics }) => {
  const [selectedComponents, setSelectedComponents] = useState([]);

  return (
    <div className={styles.grid}>
      <div className={styles.view}>
        <Graph
          system={system}
          dimensions={dimensions}
          setSelection={setSelectedComponents}
        />
        <div className={styles.imageKey}>
          <ImageKey />
        </div>
      </div>

      <MetricsWrapper
        metrics={metrics}
        selectedComponents={selectedComponents}
      />
    </div>
  );
};

const SystemPage = () => {
  const [dimensions, setDimensions] = useState([]);
  const router = useRouter();
  const { loading, system, metrics } = useSystem(router.query.id);

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <Header title={system.name} />

      <main className={styles.main}>
        <PageHeader router={router} title={system.name} />

        <DimensionSelector
          dimensions={dimensions}
          updateDimensions={setDimensions}
        />

        <GraphAndMetrics
          system={system}
          dimensions={dimensions}
          metrics={metrics}
        />
      </main>
    </div>
  );
};

export default SystemPage;
