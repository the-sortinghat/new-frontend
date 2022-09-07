import { useRouter } from "next/router";
import { useState } from "react";
import { registerNewSystem } from "../services/system_service";

const useRegisterSystem = ({ onSuccess, onFailure }) => {
  const [repoUrl, setRepoUrl] = useState("");
  const [filename, setFilename] = useState("");
  const router = useRouter();

  const registerSystem = async () => {
    try {
      const response = await registerNewSystem(repoUrl, filename);

      if (response.status === 201) {
        onSuccess();
        router.push(`/systems/${response.data.name}`);
      } else {
        onFailure(response.data.error);
      }
    } catch (e) {
      onFailure(e.response.data.error);
    }
  };

  return { registerSystem, repoUrl, setRepoUrl, filename, setFilename };
};

export default useRegisterSystem;
