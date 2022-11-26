import Image from "next/image";
import Link from "next/link";
import Button from "../components/Button";
import Header from "../components/Header";
import SystemsList from "../components/SystemsList";
import useSystems from "../hooks/useSystems";
import styles from "../styles/Home.module.css";

const Home = () => {
  const { loading, systems, onSearch } = useSystems();

  return (
    <div className={styles.container}>
      <Header title="Sorting Hat" />

      <main className={styles.main}>
        <div className={styles.registerLinkContainer}>
          <Link href="/systems/register">
            <Button text={"Register new system"} />
          </Link>
        </div>

        <div className={styles.imageContainer}>
          <Image
            src="/sortinghat.png"
            alt="Sorting Hat Logo"
            width={100}
            height={100}
          />
        </div>

        <h1 className={styles.title}>Welcome to Sorting Hat!</h1>

        <input
          className={styles.search}
          type="text"
          placeholder="Search..."
          onChange={(e) => onSearch(e.target.value)}
        />

        {loading ? <p>Loading...</p> : <SystemsList systems={systems} />}
      </main>
    </div>
  );
};

export default Home;
