import React, { ButtonHTMLAttributes } from "react";
import { LoadingSpinner, LoadingSpinnerWrapper, StyledButton } from "./styled";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export const Button = ({ loading = false, children, ...rest }: Props) => (
  <StyledButton disabled={loading} {...rest}>
    {loading ? (
      <LoadingSpinnerWrapper>
        <LoadingSpinner data-testid="loading-spinner" />
      </LoadingSpinnerWrapper>
    ) : (
      children
    )}
  </StyledButton>
);
