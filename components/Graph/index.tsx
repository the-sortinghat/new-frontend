import useGraph from "@hooks/useGraph";
import { GraphContainer, GraphWrapper } from "./styled";

const Graph = ({
  system,
  dimensions,
  depth,
  selected,
  onSelection,
  seeModules,
  showOperations,
  focusedComponent,
}: any) => {
  const graphRef = useGraph({
    system,
    dimensions,
    depth,
    selected,
    onSelection,
    seeModules,
    showOperations,
    focusedComponent,
  });

  return (
    <GraphContainer>
      <GraphWrapper ref={graphRef}></GraphWrapper>
    </GraphContainer>
  );
};

export default Graph;
