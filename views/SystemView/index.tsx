import { useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import DimensionSelector from "@components/DimensionSelector";
import Header from "@components/Header";
import MetricsWrapper from "@components/MetricsWrapper";
import useSystem from "@hooks/useSystem";
import Checkbox from "@components/Checkbox";
import {
  BackButton,
  Container,
  GraphAndImageKeyWrapper,
  GraphAndMetricsGrid,
  GraphDepthControl,
  GraphDepthControlInput,
  ImageKeyWrapper,
  LoadingContainer,
  MainContentWrapper,
  PageHeaderWrapper,
  Title,
} from "./styled";

const Graph = dynamic(() => import("@components/Graph"), { ssr: false });
const ImageKey = dynamic(() => import("@components/ImageKey"), {
  ssr: false,
});

const PageHeader = ({ router, title }: any) => {
  return (
    <PageHeaderWrapper>
      <BackButton type="button" onClick={() => router.back()}>
        &larr;
      </BackButton>

      <Title>{title}</Title>
    </PageHeaderWrapper>
  );
};

const GraphAndMetrics = ({
  system,
  dimensions,
  metrics,
  seeModules,
  showOperations,
}: any) => {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [focusedComponent, setFocusedComponent] = useState(null);
  const [depth, setDepth] = useState(1);

  return (
    <GraphAndMetricsGrid>
      <GraphAndImageKeyWrapper>
        <GraphDepthControl>
          Click on a service and type a depth level you want to see.
          <>
            Depth:
            <GraphDepthControlInput
              type="number"
              value={depth}
              placeholder="Depth"
              onChange={(e) => {
                const level = parseInt(e.target.value);

                if (level >= 0) setDepth(level);
              }}
            />
          </>
        </GraphDepthControl>
        <Graph
          system={system}
          dimensions={dimensions}
          selected={selectedComponents}
          depth={depth}
          onSelection={setSelectedComponents}
          seeModules={seeModules}
          showOperations={showOperations}
          focusedComponent={focusedComponent}
        />
        <ImageKeyWrapper>
          <ImageKey />
        </ImageKeyWrapper>
      </GraphAndImageKeyWrapper>

      <MetricsWrapper
        metrics={metrics}
        selectedComponents={selectedComponents}
        onMetricClick={setFocusedComponent}
      />
    </GraphAndMetricsGrid>
  );
};

const SystemView = () => {
  const [dimensions, setDimensions] = useState([]);
  const [seeModules, setSeeModules] = useState(false);
  const [showOperations, setShowOperations] = useState(false);
  const router = useRouter();
  const { loading, system, metrics }: any = useSystem(router.query.id);

  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;

  return (
    <Container>
      <Header title={system.name} />

      <MainContentWrapper>
        <PageHeader router={router} title={system.name} />

        <DimensionSelector
          dimensions={dimensions}
          updateDimensions={setDimensions}
        />

        <Checkbox
          name="Link synchronous communications through operations"
          checked={showOperations}
          onChange={() => setShowOperations((previous) => !previous)}
        />

        <Checkbox
          name="Group services by deployment unit (Modules)"
          checked={seeModules}
          onChange={() => setSeeModules((previous) => !previous)}
        />

        <GraphAndMetrics
          system={system}
          dimensions={dimensions}
          metrics={metrics}
          seeModules={seeModules}
          showOperations={showOperations}
        />
      </MainContentWrapper>
    </Container>
  );
};

export default SystemView;
