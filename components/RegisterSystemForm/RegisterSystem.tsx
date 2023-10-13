import Button from "@components/Button";
import {
  RegisterForm,
  RegisterFormFieldset,
  RegisterFormInput,
  RegisterFormLabel,
} from "./styled";

const RegisterSystem = ({ loading, formData, onFormSubmit }: any) => {
  const {
    repoUrl,
    setRepoUrl,
    dockerComposeFilename,
    setDockerComposeFilename,
  } = formData;

  return (
    <RegisterForm onSubmit={onFormSubmit}>
      <RegisterFormFieldset>
        <RegisterFormLabel htmlFor="repository_url">
          Repository URL:
        </RegisterFormLabel>
        <RegisterFormInput
          type="text"
          name="repository_url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
      </RegisterFormFieldset>

      <RegisterFormFieldset>
        <RegisterFormLabel htmlFor="repository_url">
          Docker-Compose filename:
        </RegisterFormLabel>
        <RegisterFormInput
          type="text"
          name="repository_url"
          value={dockerComposeFilename}
          onChange={(e) => setDockerComposeFilename(e.target.value)}
        />
      </RegisterFormFieldset>

      <Button type="submit" text={"Register"} loading={loading} />
    </RegisterForm>
  );
};

export default RegisterSystem;
