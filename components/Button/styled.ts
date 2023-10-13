import styled, { keyframes } from "styled-components";

const spinnerAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

export const LoadingSpinnerWrapper = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
`;

export const LoadingSpinner = styled.div`
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3; /* Light grey */
  border-top: 2px solid #383636; /* Blue */
  border-radius: 50%;
  animation: ${spinnerAnimation} 1.5s linear infinite;
`;

export const StyledButton = styled.button`
  background-color: #6b46c1;
  color: white;
  margin-left: auto;
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  height: 50px;

  &:hover {
    background-color: #4e2ba0;
    transition: 0.5s;
  }
`;
