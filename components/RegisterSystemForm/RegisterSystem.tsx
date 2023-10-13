import Button from "@components/Button";
import styles from "./styles.module.css";

const RegisterSystem = ({ loading, formData, onFormSubmit }: any) => {
  const {
    repoUrl,
    setRepoUrl,
    dockerComposeFilename,
    setDockerComposeFilename,
  } = formData;

  return (
    <form className={styles.registerForm} onSubmit={onFormSubmit}>
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
          value={dockerComposeFilename}
          onChange={(e) => setDockerComposeFilename(e.target.value)}
        />
      </fieldset>

      <Button type="submit" text={"Register"} loading={loading} />
    </form>
  );
};

export default RegisterSystem;
