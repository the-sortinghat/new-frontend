import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import dynamic from "next/dynamic";
import DimensionSelector from "@/components/DimensionSelector";
import Header from "@/components/Header";
import MetricsWrapper from "@/components/MetricsWrapper";
import styles from "@/styles/SystemPage.module.css";
import { getSystemById, getSystemMetrics } from "@/services/system_service";
import { Dimension, System, SystemMetrics } from "@/types/system";

const Graph = dynamic(() => import("@/components/Graph"), { ssr: false });
const ImageKey = dynamic(() => import("@/components/ImageKey"), { ssr: false });

type PageHeaderProps = {
  router: NextRouter;
  title: string;
};

type GraphAndMetricsProps = {
  system: System;
  dimensions: Dimension[];
  metrics: SystemMetrics;
};

const PageHeader = ({ router, title }: PageHeaderProps) => {
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

const GraphAndMetrics = (props: GraphAndMetricsProps) => {
  const { system, dimensions, metrics } = props;
  const [selectedComponents, setSelectedComponents] = useState<any>([]);

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

const SystemPage: NextPage = () => {
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
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
        .then((metrics) => {
          setSystemMetrics(metrics);
          setLoading(false);
          setLoading;
        });
    }
  }, [router.isReady, router.query]);

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
          metrics={systemMetrics}
        />
      </main>
    </div>
  );
};

export default SystemPage;
