import React, { useMemo, useReducer } from "react";
import { System } from "@model/system";

interface SystemState {
  system: System | null;
}

interface SystemAction {
  system: System | null;
}

const initialState: SystemState = {
  system: null,
};

export const SystemContext = React.createContext<{
  state: SystemState;
  dispatch: React.Dispatch<SystemAction>;
}>({
  state: initialState,
  dispatch: (_) => null,
});

const systemReducer = (_: SystemState, action: SystemAction): SystemState => ({
  system: action.system,
});

export const SystemProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = useReducer(systemReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <SystemContext.Provider value={contextValue}>
      {children}
    </SystemContext.Provider>
  );
};
