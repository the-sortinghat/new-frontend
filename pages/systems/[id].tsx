import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Checkbox from "../../components/Checkbox";
import Header from "../../components/Header";
import { getSystemById } from "../../services/system_data";
import styles from "../../styles/SystemPage.module.css";
import { System } from "../../types/system";

const Graph = dynamic(() => import("../../components/Graph"), { ssr: false });

const SystemPage: NextPage = () => {
  const [system, setSystem] = useState<System>({} as System);
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
          <div className={styles.dimensions}>
            <h2>Dimensions</h2>
            <Checkbox name="Size" />
            <Checkbox name="Data coupling" />
            <Checkbox name="Sync coupling" />
            <Checkbox name="Async coupling" />
          </div>
          <div className={styles.view}>
            <Graph />
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
