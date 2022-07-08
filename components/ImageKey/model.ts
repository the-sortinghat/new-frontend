import { makeLayout, stylesheet } from "@/components/ImageKey/imagekey_styles";
import { ElementDefinition } from "cytoscape";

const getElements = (): ElementDefinition[] => [
  { data: { type: "ellipse", label: "Service" } },
  { data: { type: "rectangle", label: "Module" } },
  { data: { type: "hexagon", label: "Database" } },
  { data: { id: "n01", label: "", type: "ellipse" } },
  { data: { id: "n02", label: "", type: "ellipse" } },
  { data: { id: "n03", label: "", type: "ellipse" } },
  { data: { id: "n04", label: "", type: "ellipse" } },
  { data: { id: "n05", label: "", type: "ellipse" } },
  { data: { id: "n06", label: "", type: "hexagon" } },
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
];

const imageKeyModel = { getElements, makeLayout, stylesheet };

export default imageKeyModel;
