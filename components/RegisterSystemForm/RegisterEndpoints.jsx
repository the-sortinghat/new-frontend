import styles from "./styles.module.css";

const RegisterEndpoints = ({ formData, handleFormChange, onFormSubmit }) => {
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

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterEndpoints;
