import React, { ButtonHTMLAttributes } from "react";
import { LoadingSpinner, LoadingSpinnerWrapper, StyledButton } from "./styled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  text?: string;
}

const Button = ({ loading = false, text, ...rest }: ButtonProps) => {
  return (
    <StyledButton disabled={loading} {...rest}>
      {loading ? (
        <LoadingSpinnerWrapper>
          <LoadingSpinner />
        </LoadingSpinnerWrapper>
      ) : (
        text
      )}
    </StyledButton>
  );
};

export default Button;
