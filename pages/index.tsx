import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";

type System = {
  id: number;
  name: string;
  description: string;
};

const Header: React.FC = () => {
  return (
    <Head>
      <title>Sorting Hat</title>
      <meta
        name="description"
        content="A tool to characterize the architecture of service-based systems"
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

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

const Footer: React.FC = () => {
  const getCurrentYear = () => new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <a
        href="https://github.com/erickrodrigs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Copyright © 2021 - {getCurrentYear()}. Developed by Erick Rodrigues de
        Santana.
      </a>
    </footer>
  );
};

const Home: NextPage = () => {
  const [allSystems, setAllSystems] = useState<System[]>([]);
  const [filteredSystems, setFilteredSystems] = useState<System[]>(allSystems);

  useEffect(() => {
    fetch("api/systems")
      .then((response) => response.json())
      .then((systems) => {
        setAllSystems(systems);
        setFilteredSystems(systems);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Header />

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

        <SystemsList systems={filteredSystems} />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
