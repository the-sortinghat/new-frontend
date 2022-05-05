import type { NextPage } from "next";
import { useRouter } from "next/router";
import Checkbox from "../../components/Checkbox";
import Graph from "../../components/Graph";
import Header from "../../components/Header";
import styles from "../../styles/SystemPage.module.css";

const SystemPage: NextPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Header title="InterSCity" />

      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <button
            type="button"
            className={styles.back}
            onClick={() => router.back()}
          >
            &larr;
          </button>

          <h1 className={styles.title}>InterSCity</h1>
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
