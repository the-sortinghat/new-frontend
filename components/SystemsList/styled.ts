import styled from "styled-components";

export const ListWrapper = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;
  }
`;

export const Card = styled.article`
  margin: 1rem;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: color 0.15s ease, border-color 0.15s ease;
  max-width: 300px;
  height: 300px;
  cursor: pointer;

  &:hover,
  &:focus,
  &:active {
    color: #6b46c1;
    border-color: #6b46c1;
  }
`;

export const CardTitle = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 500;
`;

export const CardDescription = styled.p`
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;
