import Button from "@components/Button";
import {
  RegisterForm,
  RegisterFormFieldset,
  RegisterFormInput,
  RegisterFormLabel,
} from "./styled";

const RegisterEndpoints = ({
  loading,
  formData,
  handleFormChange,
  onFormSubmit,
}: any) => {
  return (
    <RegisterForm onSubmit={onFormSubmit}>
      {Object.entries(formData).map(([serviceName, openApiFilename]) => (
        <RegisterFormFieldset key={serviceName}>
          <RegisterFormLabel htmlFor={serviceName}>
            OpenAPI filename for service {serviceName}:
          </RegisterFormLabel>
          <RegisterFormInput
            type="text"
            name={serviceName}
            value={openApiFilename as string}
            onChange={handleFormChange}
          />
        </RegisterFormFieldset>
      ))}

      <Button type="submit" text={"Register"} loading={loading} />
    </RegisterForm>
  );
};

export default RegisterEndpoints;
