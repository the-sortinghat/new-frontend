export type Node = {
  id: number | string;
  label: string;
  parent?: number | string;
  type: "module" | "service" | "database" | "operation";
  operations?: string[];
};

export type Edge = {
  id: number | string;
  source: number | string;
  target: number | string;
  type: "async" | "sync" | "db" | "operation";
  label?: string;
};

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};
