import Header from "../../components/Header";
import useRegisterSystem from "../../hooks/useRegisterSystem";
import styles from "../../styles/RegisterSystem.module.css";

const RegisterSystemPage = () => {
  const { registerSystem, repoUrl, setRepoUrl, filename, setFilename } =
    useRegisterSystem({
      onSuccess: () => alert("New system registered!"),
      onFailure: (error) => alert(error),
    });

  return (
    <div className={styles.container}>
      <Header title="Register new system" />

      <main className={styles.main}>
        <h1 className={styles.title}>Register new system</h1>

        <form
          className={styles.registerForm}
          onSubmit={(e) => {
            e.preventDefault();
            registerSystem();
          }}
        >
          <fieldset>
            <label htmlFor="repository_url">Repository URL:</label>
            <input
              className={styles.registerInput}
              type="text"
              name="repository_url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
            />
          </fieldset>

          <fieldset>
            <label htmlFor="repository_url">Docker-Compose filename:</label>
            <input
              className={styles.registerInput}
              type="text"
              name="repository_url"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
            />
          </fieldset>

          <button type="submit">Register</button>
        </form>
      </main>
    </div>
  );
};

export default RegisterSystemPage;
