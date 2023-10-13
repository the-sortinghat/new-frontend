import styled from "styled-components";

export const Checkmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 15px;
  width: 15px;
  background-color: #ccc;

  &:after {
    content: "";
    position: absolute;
    display: none;
    left: 5px;
    top: 0px;
    width: 3px;
    height: 8px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`;

export const CheckboxInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

export const CheckboxLabel = styled.label`
  display: block;
  position: relative;
  padding-left: 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  &:hover ${CheckboxInput} ~ ${Checkmark} {
    background-color: #ccc;
  }

  & ${CheckboxInput}:checked ~ ${Checkmark} {
    background-color: #6b46c1;
  }

  & ${CheckboxInput}:checked ~ ${Checkmark}:after {
    display: block;
  }
`;
