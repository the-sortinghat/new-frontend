import Button from "../Button";
import styles from "./styles.module.css";

const RegisterEndpoints = ({
  loading,
  formData,
  handleFormChange,
  onFormSubmit,
}) => {
  return (
    <form className={styles.registerForm} onSubmit={onFormSubmit}>
      {Object.entries(formData).map(([serviceName, openApiFilename]) => (
        <fieldset key={serviceName}>
          <label htmlFor={serviceName}>
            OpenAPI filename for service {serviceName}:
          </label>
          <input
            className={styles.registerInput}
            type="text"
            name={serviceName}
            value={openApiFilename}
            onChange={handleFormChange}
          />
        </fieldset>
      ))}

      <Button type="submit" text={"Register"} loading={loading} />
    </form>
  );
};

export default RegisterEndpoints;
