import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: string[];
}

const Select: React.FC<SelectProps> = ({ name, options, ...rest }) => {
  return (
    <select name={name} {...rest}>
      <option value="select">Select</option>
      {options.map((op) => (
        <option key={op} value={op}>
          {op}
        </option>
      ))}
    </select>
  );
};

export default Select;
