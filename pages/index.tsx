import Header from "@/components/Header";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";
import { System } from "@/types/system";
import { getAllSystems } from "@/services/system_data";

const SearchInput: React.FC<{
  systems: System[];
  onSearch: (systems: System[]) => void;
}> = ({ systems, onSearch }) => {
  const searchSystem = (query: string) => {
    onSearch(
      systems.filter(
        ({ name, description }) =>
          name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
          description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      )
    );
  };

  return (
    <input
      className={styles.search}
      type="text"
      placeholder="Search..."
      onChange={(e) => searchSystem(e.target.value)}
    />
  );
};

const SystemsList: React.FC<{ systems: System[] }> = ({ systems }) => {
  const getSystemUrl = (id: number) => `/systems/${id}`;

  return (
    <div className={styles.grid}>
      {systems.length > 0 ? (
        systems.map(({ id, name, description }) => (
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

const Home: NextPage = () => {
  const [allSystems, setAllSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>(allSystems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllSystems().then((systems) => {
      setAllSystems(systems);
      setFilteredSystems(systems);
      setLoading(false);
    });
  }, []);

  return (
    <div className={styles.container}>
      <Header title="Sorting Hat" />

      <main className={styles.main}>
        <Link href="/systems/register">
          <button className={styles.register}>Register new system</button>
        </Link>

        <div className={styles.imageContainer}>
          <Image
            src="/sortinghat.png"
            alt="Sorting Hat Logo"
            width={100}
            height={100}
          />
        </div>

        <h1 className={styles.title}>Welcome to Sorting Hat!</h1>

        <SearchInput systems={allSystems} onSearch={setFilteredSystems} />

        {loading ? (
          <p>Loading...</p>
        ) : (
          <SystemsList systems={filteredSystems} />
        )}
      </main>
    </div>
  );
};

export default Home;
