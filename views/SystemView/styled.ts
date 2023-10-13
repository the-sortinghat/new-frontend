import styled from "styled-components";

export const LoadingContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Container = styled.div`
  padding: 0 2rem;
`;

export const MainContentWrapper = styled.main`
  min-height: 100vh;
  padding: 1rem 0;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const PageHeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const BackButton = styled.button`
  position: absolute;
  color: #6b46c1;
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  font-size: 3rem;
`;

export const Title = styled.h1`
  margin: 0 auto;
  line-height: 1.15;
  font-size: 2rem;
  text-align: center;
  color: #6b46c1;
`;

export const GraphAndMetricsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;

  @media screen and (max-width: 1000px) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`;

export const GraphAndImageKeyWrapper = styled.div`
  width: 100%;
  height: 80vh;
`;

export const ImageKeyWrapper = styled.div`
  width: 100%;

  @media screen and (max-width: 1000px) {
    height: 120px;
  }
`;

export const GraphDepthControl = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const GraphDepthControlInput = styled.input``;
