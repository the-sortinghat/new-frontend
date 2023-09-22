import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useMemo,
  useReducer,
} from "react";
import { ViewAction } from "./actions";
import { viewReducer } from "./reducer";
import { ViewState } from "./types";

const initialState: ViewState = {
  selectedDimensions: [],
  showModules: false,
  showOperations: false,
  depthLevel: 1,
  selectedElement: { type: "services", name: "" },
  focusedElement: { type: "services", name: "" },
};

export const ViewContext = createContext<{
  state: ViewState;
  dispatch: Dispatch<ViewAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const ViewProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(viewReducer, initialState);
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <ViewContext.Provider value={contextValue}>{children}</ViewContext.Provider>
  );
};
