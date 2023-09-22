import { Dimension } from "@model/dimension";
import { Element, ViewActions, ViewState } from "./types";

export interface ViewAction {
  type: ViewActions;
  payload: ViewState;
}

export const setSelectedDimensionsAction = (
  dimensions: Dimension[]
): ViewAction => ({
  type: ViewActions.SET_DIMENSIONS,
  payload: { selectedDimensions: dimensions },
});

export const setShowModulesAction = (showModules: boolean): ViewAction => ({
  type: ViewActions.SET_SHOW_MODULES,
  payload: { showModules },
});

export const setShowOperationsAction = (
  showOperations: boolean
): ViewAction => ({
  type: ViewActions.SET_SHOW_OPERATIONS,
  payload: { showOperations },
});

export const setDepthLevelAction = (depthLevel: number): ViewAction => ({
  type: ViewActions.SET_DEPTH_LEVEL,
  payload: { depthLevel },
});

export const setSelectedElementAction = (
  selectedElement: Element
): ViewAction => ({
  type: ViewActions.SET_SELECTED_ELEMENT,
  payload: { selectedElement },
});

export const setFocusedElementAction = (
  focusedElement: Element
): ViewAction => ({
  type: ViewActions.SET_FOCUSED_ELEMENT,
  payload: { focusedElement },
});
