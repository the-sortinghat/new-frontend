import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import DimensionSelector from "../../components/DimensionSelector";
import Header from "../../components/Header";
import MetricsWrapper from "../../components/MetricsWrapper";
import useSystem from "../../hooks/useSystem";
import styles from "../../styles/SystemPage.module.css";
import Checkbox from "../../components/Checkbox";

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

const GraphAndMetrics = ({ system, dimensions, metrics, seeModules }) => {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [depth, setDepth] = useState(1);

  return (
    <div className={styles.grid}>
      <div className={styles.view}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          Click on a service and type a depth level you want to see.
          <div>
            Depth:
            <input
              type="number"
              value={depth}
              placeholder="Depth"
              onChange={(e) => {
                const level = parseInt(e.target.value);

                if (level >= 0) setDepth(level);
              }}
            />
          </div>
        </div>
        <Graph
          system={system}
          dimensions={dimensions}
          selected={selectedComponents}
          depth={depth}
          onSelection={setSelectedComponents}
          seeModules={seeModules}
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
  const [seeModules, setSeeModules] = useState(false);
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

        <Checkbox
          name="Group services by deployment unit"
          checked={seeModules}
          onChange={() => setSeeModules((previous) => !previous)}
        />

        <GraphAndMetrics
          system={system}
          dimensions={dimensions}
          metrics={metrics}
          seeModules={seeModules}
        />
      </main>
    </div>
  );
};

export default SystemPage;
