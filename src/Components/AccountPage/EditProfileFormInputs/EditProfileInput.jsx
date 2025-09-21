import s from "./EditProfileInput.module.scss";

const EditProfileInput = ({
  inputData: {
    label,
    name,
    type = "text",
    value,
    setValue,
    required = false,
    autoComplete = false,
    placeholder = "",
    options = null, // For select dropdown
    disabled = false,
  },
}) => {
  const commonAttributes = {
    name,
    id: name,
    disabled: disabled || false,
  };

  const inputAttributes = {
    ...commonAttributes,
    type: type || "text",
    value,
    required: required || false,
    "aria-required": required,
    autoComplete: autoComplete ? "on" : "off",
    onChange: setValue ? (e) => setValue(e.target.value) : null,
    placeholder: placeholder || "",
  };

  const selectAttributes = {
    ...commonAttributes,
    value,
    required: required || false,
    "aria-required": required,
    onChange: setValue ? (e) => setValue(e.target.value) : null,
  };

  return (
    <div className={s.input}>
      {label && <label htmlFor={name}>{label}</label>}
      {options ? (
        <div className={s.radioGroup}>
          {options.map((option) => {
            const isChecked = value === option.value;
            return (
              <label
                key={option.value}
                className={`${s.radioLabel} ${isChecked ? s.selected : ''}`}
              >
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isChecked}
                  onChange={(e) => setValue && setValue(e.target.value)}
                  className={s.radioInput}
                />
                <span className={s.radioText}>{option.label}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <input {...inputAttributes} />
      )}
    </div>
  );
};
export default EditProfileInput;
