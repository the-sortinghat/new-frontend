import { Dimension } from "./dimension";

interface PerComponent {
  modules: { [key: string]: number | { [key: string]: number } };
  services: { [key: string]: number | { [key: string]: number } };
}

interface SizeMetrics {
  "Number of system components": string;
  "Number of services with deployment dependency": number;
  "Number of operations per component": PerComponent;
}

interface DataCouplingMetrics {
  "Number of data sources that each component shares with others": PerComponent;
  "Number of data sources per component": PerComponent;
  "Number of data sources where each component performs Read operations": PerComponent;
  "Number of data sources where each component performs Write operations": PerComponent;
  "Number of data sources where each component performs ReadWrite operations": PerComponent;
}

interface SyncCouplingMetrics {
  "Number of clients that invoke the operations of a given component": PerComponent;
  "Number of components from which a given component invokes operations": PerComponent;
  "Number of different operations invoked from other components": PerComponent;
  "Number of different operations invoked by each depending component": PerComponent;
}

interface AsyncCouplingMetrics {
  "Number of clients that consume messages published by a given component": PerComponent;
  "Number of components from which a given component consumes messages": PerComponent;
  "Number of components that consume messages from the queue": PerComponent;
  "Number of components that publish messages in the queue": PerComponent;
  "Number of different types of messages consumed from other components": PerComponent;
  "Number of different types of messages consumed by each depending component": PerComponent;
}

export interface CharM {
  [Dimension.SIZE]: SizeMetrics;
  [Dimension.DATA_COUPLING]: DataCouplingMetrics;
  [Dimension.SYNC_COUPLING]: SyncCouplingMetrics;
  [Dimension.ASYNC_COUPLING]: AsyncCouplingMetrics;
}

export type Metrics =
  | SizeMetrics
  | DataCouplingMetrics
  | SyncCouplingMetrics
  | AsyncCouplingMetrics;
