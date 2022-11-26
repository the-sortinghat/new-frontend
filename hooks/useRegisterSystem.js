import { useRouter } from "next/router";
import { useState } from "react";
import {
  registerNewSystem,
  registerSystemEndpoints,
} from "../services/system_service";

const useRegisterSystem = () => {
  const [loading, setLoading] = useState(false);
  const [isSystemRegistration, setIsSystemRegistration] = useState(true);
  const [repoUrl, setRepoUrl] = useState("");
  const [dockerComposeFilename, setDockerComposeFilename] = useState("");
  const [systemName, setSystemName] = useState("");
  const [openApiFilenames, setOpenApiFilenames] = useState({});
  const router = useRouter();

  const goToEndpointsRegistration = () => {
    setIsSystemRegistration(false);
  };

  const handleRegisterEndpointsFormChange = (event) => {
    const data = { ...openApiFilenames };
    data[event.target.name] = event.target.value;
    setOpenApiFilenames(data);
  };

  const registerSystem = async ({ onSuccess, onFailure }) => {
    setLoading(true);

    try {
      const response = await registerNewSystem(repoUrl, dockerComposeFilename);
      setLoading(false);

      if (response.status === 201) {
        onSuccess();
        setSystemName(response.data.name);
        setOpenApiFilenames(
          response.data.services.reduce(
            (acc, service) => ({ ...acc, [service.name]: "" }),
            {}
          )
        );
      } else {
        onFailure(response.data.error);
      }
    } catch (e) {
      setLoading(false);
      onFailure(e.response.data.error);
    }
  };

  const registerEndpoints = async ({ onSuccess, onFailure }) => {
    setLoading(true);

    try {
      const servicesAndOpenApiFilenames = [];

      for (const serviceName in openApiFilenames) {
        servicesAndOpenApiFilenames.push({
          serviceName,
          openApiFilename: openApiFilenames[serviceName],
        });
      }

      const response = await registerSystemEndpoints(
        repoUrl,
        systemName,
        servicesAndOpenApiFilenames
      );

      if (response.status === 200) {
        setLoading(false);
        onSuccess();
        router.push(`/systems/${systemName}`);
      } else {
        onFailure(response.data.error);
      }
    } catch (e) {
      setLoading(false);
      onFailure(e.response.data.error);
    }
  };

  return {
    loading,
    registerSystem,
    registerEndpoints,
    handleRegisterEndpointsFormChange,
    goToEndpointsRegistration,
    repoUrl,
    setRepoUrl,
    dockerComposeFilename,
    setDockerComposeFilename,
    openApiFilenames,
    isSystemRegistration,
  };
};

export default useRegisterSystem;
