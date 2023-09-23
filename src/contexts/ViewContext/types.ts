import { Dimension } from "@model/dimension";

export interface Element {
  type?: "modules" | "services";
  name: string;
}

export interface ViewState {
  selectedDimensions?: Dimension[];
  showModules?: boolean;
  showOperations?: boolean;
  depthLevel?: number;
  selectedElement?: Element;
  focusedElement?: Element;
}

export enum ViewActions {
  SET_DIMENSIONS,
  SET_SHOW_MODULES,
  SET_SHOW_OPERATIONS,
  SET_DEPTH_LEVEL,
  SET_SELECTED_ELEMENT,
  SET_FOCUSED_ELEMENT,
}
