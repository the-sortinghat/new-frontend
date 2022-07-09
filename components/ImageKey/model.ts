import { makeLayout, stylesheet } from "@/components/ImageKey/imagekey_styles";
import { ElementDefinition } from "cytoscape";

const getElements = (): ElementDefinition[] => [
  { data: { type: "ellipse", label: "Service", color: "gray" } },
  { data: { type: "rectangle", label: "Module", color: "gray" } },
  { data: { type: "hexagon", label: "Database", color: "green" } },
  { data: { type: "diamond", label: "operation", color: "blue" } },
  { data: { id: "n01", label: "", type: "ellipse", color: "gray" } },
  { data: { id: "n02", label: "", type: "ellipse", color: "gray" } },
  { data: { id: "n03", label: "", type: "ellipse", color: "gray" } },
  { data: { id: "n04", label: "", type: "ellipse", color: "gray" } },
  { data: { id: "n05", label: "", type: "ellipse", color: "gray" } },
  { data: { id: "n06", label: "", type: "hexagon", color: "green" } },
  { data: { id: "n07", label: "", type: "ellipse", color: "gray" } },
  { data: { id: "n08", label: "", type: "diamond", color: "blue" } },
  {
    data: {
      id: "n01n02",
      source: "n01",
      target: "n02",
      type: "sync",
      caption: "Synchronous call",
    },
  },
  {
    data: {
      id: "n03n04",
      source: "n03",
      target: "n04",
      type: "async",
      caption: "Asynchronous call",
    },
  },
  {
    data: {
      id: "n05n06",
      source: "n05",
      target: "n06",
      label: "R/W",
      type: "db",
      caption: "Database usage",
    },
  },
  {
    data: {
      id: "n07n08",
      source: "n07",
      target: "n08",
      type: "operation",
      caption: "Service exposes operation",
    },
  },
];

const imageKeyModel = { getElements, makeLayout, stylesheet };

export default imageKeyModel;
