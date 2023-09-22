import React, { InputHTMLAttributes } from "react";
import { CheckboxInput, CheckboxLabel, Checkmark } from "./styled";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Checkbox = ({ name, ...rest }: Props) => (
  <CheckboxLabel>
    {name}
    <CheckboxInput type="checkbox" {...rest} />
    <Checkmark></Checkmark>
  </CheckboxLabel>
);
