import { ViewAction } from "./actions";
import { ViewActions, ViewState } from "./types";

export const viewReducer = (
  state: ViewState,
  { type, payload }: ViewAction
): ViewState => {
  switch (type) {
    case ViewActions.SET_DIMENSIONS:
      return {
        ...state,
        selectedDimensions: payload.selectedDimensions,
      };
    case ViewActions.SET_SHOW_MODULES:
      return {
        ...state,
        showModules: payload.showModules,
      };
    case ViewActions.SET_SHOW_OPERATIONS:
      return {
        ...state,
        showOperations: payload.showOperations,
      };
    case ViewActions.SET_DEPTH_LEVEL:
      return {
        ...state,
        depthLevel: payload.depthLevel,
      };
    case ViewActions.SET_SELECTED_ELEMENT:
      return {
        ...state,
        selectedElement: payload.selectedElement,
      };
    case ViewActions.SET_FOCUSED_ELEMENT:
      return {
        ...state,
        focusedElement: payload.focusedElement,
      };
    default:
      throw new Error("invalid view action type");
  }
};
