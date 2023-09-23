import { System } from "@model/system";
import { useContext } from "react";
import { SystemContext } from "./SystemContext";

export const useSystemContext = () => {
  const { state, dispatch } = useContext(SystemContext);

  const setSystem = (system: System) => dispatch({ system });

  return {
    system: state.system,
    setSystem,
  };
};
