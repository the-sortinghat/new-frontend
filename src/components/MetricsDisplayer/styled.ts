import styled from "styled-components";

export const MetricContainer = styled.article`
  margin-bottom: 0.5rem;
  background-color: #dfdfdf;
  border-radius: 0.5rem;
  padding: 0.5rem;
`;

export const MetricName = styled.h5`
  font-weight: 500;
`;

const metricValue = "margin-left: 0.5rem;";

export const MetricValue = styled.p`
  ${metricValue}
`;

export const MetricValueWrapper = styled.div`
  ${metricValue}
`;

export const MetricValueList = styled.ul`
  ${metricValue}
`;

export const ListItem = styled.li``;

export const ClickableWrapper = styled.div`
  display: inline;
`;

export const Clickable = styled.p`
  text-decoration: underline;
  cursor: pointer;
`;
