import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import { getAllSystems } from "../services/system_service";
import styles from "../styles/Home.module.css";

const SearchInput = ({ systems, onSearch }) => {
  const searchSystem = (query) => {
    const searchResult = systems.filter(
      ({ name, description }) =>
        name.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        description.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );

    onSearch(searchResult);
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

const SystemsList = ({ systems }) => {
  const getSystemUrl = (id) => `/systems/${id}`;

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

const Home = () => {
  const [allSystems, setAllSystems] = useState([]);
  const [filteredSystems, setFilteredSystems] = useState(allSystems);
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
