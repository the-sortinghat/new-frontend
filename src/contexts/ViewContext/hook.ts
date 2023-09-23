import { Dimension } from "@model/dimension";
import { useContext } from "react";
import {
  setDepthLevelAction,
  setFocusedElementAction,
  setSelectedDimensionsAction,
  setSelectedElementAction,
  setShowModulesAction,
  setShowOperationsAction,
} from "./actions";
import { Element } from "./types";
import { ViewContext } from "./ViewContext";

export const useViewContext = () => {
  const { state, dispatch } = useContext(ViewContext);

  const setSelectedDimensions = (dimensions: Dimension[]) =>
    dispatch(setSelectedDimensionsAction(dimensions));

  const setShowModules = (showModules: boolean) =>
    dispatch(setShowModulesAction(showModules));

  const setShowOperations = (showOperations: boolean) =>
    dispatch(setShowOperationsAction(showOperations));

  const setDepthLevel = (depthLevel: number) =>
    dispatch(setDepthLevelAction(depthLevel));

  const setSelectedElement = (selectedElement: Element) =>
    dispatch(setSelectedElementAction(selectedElement));

  const setFocusedElement = (focusedElement: Element) =>
    dispatch(setFocusedElementAction(focusedElement));

  return {
    ...state,
    setSelectedDimensions,
    setShowModules,
    setShowOperations,
    setDepthLevel,
    setSelectedElement,
    setFocusedElement,
  };
};
