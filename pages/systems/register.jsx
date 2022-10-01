import Header from "../../components/Header";
import RegisterSystem from "../../components/RegisterSystemForm/RegisterSystem";
import RegisterEndpoints from "../../components/RegisterSystemForm/RegisterEndpoints";
import useRegisterSystem from "../../hooks/useRegisterSystem";
import styles from "../../styles/RegisterSystem.module.css";

const RegisterSystemPage = () => {
  const {
    registerSystem,
    registerEndpoints,
    handleRegisterEndpointsFormChange,
    goToEndpointsRegistration,
    openApiFilenames,
    repoUrl,
    setRepoUrl,
    dockerComposeFilename,
    setDockerComposeFilename,
    isSystemRegistration,
  } = useRegisterSystem();

  const onRegisterSystem = (e) => {
    e.preventDefault();
    registerSystem({
      onSuccess: () => goToEndpointsRegistration(),
      onFailure: (error) => alert(error),
    });
  };

  const onRegisterEndpoints = (e) => {
    e.preventDefault();
    registerEndpoints({
      onSuccess: () => alert("New system has been successfully registered"),
      onFailure: (error) => alert(error),
    });
  };

  const pageTitle = isSystemRegistration
    ? "Register new system"
    : "Register endpoints";

  return (
    <div className={styles.container}>
      <Header title="Register new system" />

      <main className={styles.main}>
        <h1 className={styles.title}>{pageTitle}</h1>

        {isSystemRegistration ? (
          <RegisterSystem
            formData={{
              repoUrl,
              setRepoUrl,
              dockerComposeFilename,
              setDockerComposeFilename,
            }}
            onFormSubmit={onRegisterSystem}
          />
        ) : (
          <RegisterEndpoints
            formData={openApiFilenames}
            handleFormChange={handleRegisterEndpointsFormChange}
            onFormSubmit={onRegisterEndpoints}
          />
        )}
      </main>
    </div>
  );
};

export default RegisterSystemPage;
