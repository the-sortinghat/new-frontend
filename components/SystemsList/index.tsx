import Link from "next/link";
import styles from "./styles.module.css";

const SystemsList = ({ systems }: any) => {
  const getSystemUrl = (id: any) => `/systems/${id}`;

  return (
    <div className={styles.grid}>
      {systems.length > 0 ? (
        systems.map(({ id, name, description }: any) => (
          <Link key={name} href={getSystemUrl(id)}>
            <a className={styles.card}>
              <h2>{name} &rarr;</h2>
              <p>{description}</p>
            </a>
          </Link>
        ))
      ) : (
        <p>System not found!</p>
      )}
    </div>
  );
};

export default SystemsList;
