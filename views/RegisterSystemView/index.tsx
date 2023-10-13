import Header from "@components/Header";
import RegisterSystem from "@components/RegisterSystemForm/RegisterSystem";
import RegisterEndpoints from "@components/RegisterSystemForm/RegisterEndpoints";
import useRegisterSystem from "@hooks/useRegisterSystem";
import { Container, MainContentWrapper, Title } from "./styled";

const RegisterSystemView = () => {
  const {
    loading,
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

  const onRegisterSystem = (e: any) => {
    e.preventDefault();
    registerSystem({
      onSuccess: () => goToEndpointsRegistration(),
      onFailure: (error: any) => alert(error),
    });
  };

  const onRegisterEndpoints = (e: any) => {
    e.preventDefault();
    registerEndpoints({
      onSuccess: () => alert("New system has been successfully registered"),
      onFailure: (error: any) => alert(error),
    });
  };

  const pageTitle = isSystemRegistration
    ? "Register new system"
    : "Register endpoints";

  return (
    <Container>
      <Header title="Register new system" />

      <MainContentWrapper>
        <Title>{pageTitle}</Title>

        {isSystemRegistration ? (
          <RegisterSystem
            loading={loading}
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
            loading={loading}
            formData={openApiFilenames}
            handleFormChange={handleRegisterEndpointsFormChange}
            onFormSubmit={onRegisterEndpoints}
          />
        )}
      </MainContentWrapper>
    </Container>
  );
};

export default RegisterSystemView;
