import _ from "lodash";
import "./InputField.styles.css";
import propTypes from "./InputField.types.js";
import { DateField, SelectField, TextField } from "./inputs/index";
import { onKeyDown } from "@/utils";

const InputField = ({
  valueType,
  optionSet,
  label,
  value,
  warning,
  error,
  helperText,
  onChange,
  onBlur = null,
  disabled,
  pattern,
  locale,
  uiLocale,
  attribute = null,
  onInput,
  ...props
}) => {
  const generateSelectFieldValue = (options, value) => {
    const v = options.find((currentValue) => currentValue.code === value);
    return v ? v : null;
  };

  const generateInput = () => {
    if (optionSet) {
      const { options } = optionSet;

      return (
        <SelectField
          options={options}
          locale={locale}
          uiLocale={uiLocale}
          value={generateSelectFieldValue(options, value)}
          handleBlur={onBlur}
          handleChange={onChange}
          disabled={disabled}
          {...props}
        />
      );
    }

    if (valueType === "DATE" || valueType === "AGE") {
      return (
        <DateField
          {...(_.has(props, "periodType") && {
            periodType: props.periodType,
          })}
          value={value}
          locale={locale}
          handleBlur={onBlur}
          handleChange={onChange}
          disabled={disabled}
          uiLocale={uiLocale}
          {...props}
        />
      );
    }
    if (valueType === "BOOLEAN") {
      const vs = [
        { value: "true", label: uiLocale.yes },
        { value: "false", label: uiLocale.no },
      ];
      return (
        <SelectField
          value={generateSelectFieldValue(vs, value)}
          uiLocale={uiLocale}
          valueSet={vs}
          handleChange={onChange}
          disabled={disabled}
          {...props}
        />
      );
    }

    if (valueType === "MASK") {
      return (
        <TextField
          type="text"
          value={value}
          handleChange={onChange}
          handleBlur={onBlur}
          disabled={disabled}
          maxLength={attribute && attribute.maxLength}
          onKeyDown={(e) => {
            onKeyDown(e, pattern);
          }}
          {...props}
        />
      );
    }

    switch (valueType) {
      case "INTEGER":
      case "INTEGER_POSITIVE":
      case "INTEGER_NEGATIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            inputProps={{ min: "0" }}
            maxLength={attribute && attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, attribute.maxLength);
              }
            }}
            {...props}
          />
        );
      case "TEXT":
      case "PERCENTAGE":
      case "PHONE_NUMBER":
      case "EMAIL":
        return (
          <TextField
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            {...props}
          />
        );
      case "NUMBER":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            // maxLength={attribute && attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = Math.max(0, parseInt(e.target.value))
                  .toString()
                  .slice(0, attribute.maxLength);
              }
              // check max
              if (attribute && attribute.max) {
                e.target.value =
                  parseInt(e.target.value) > attribute.max
                    ? attribute.max
                    : parseInt(e.target.value);
              }
            }}
            {...props}
          />
        );
      case "PATTERNNUMBER":
        return (
          <TextField
            type="number"
            value={value}
            handleChange={onChange}
            handleBlur={onBlur}
            disabled={disabled}
            maxLength={attribute.maxLength}
            onInput={(e) => {
              if (attribute && attribute.maxLength) {
                e.target.value = e.target.value.replace(/^0+/, "");
                if (
                  e.target.value.split("").length <= attribute.maxLength &&
                  e.target.value.split("").length > 0
                ) {
                  let arr = [];
                  e.target.value.split("").forEach((da) => {
                    arr.push(da);
                  });
                  let arrValue = [];
                  for (let i = 1; i <= attribute.maxLength - arr.length; i++) {
                    arrValue.push(0);
                  }
                  arr.forEach((da) => {
                    arrValue.push(da);
                  });
                  e.target.value = arrValue.join("");
                } else {
                  e.target.value = Math.max(0, parseInt(e.target.value))
                    .toString()
                    .slice(0, attribute.maxLength);
                }
              }
            }}
            {...props}
          />
        );
    }
  };

  return (
    <div className="input-field-container">
      {label && <div className="input-field-label">{label}</div>}
      <div className="h-10">{generateInput()}</div>
      {warning && <div className="input-field-warning">{warning}</div>}
      {error && <div className="input-field-error">{error}</div>}
      {helperText && (
        <div className="input-field-helper-text">{helperText}</div>
      )}
    </div>
  );
};

InputField.propTypes = propTypes;
export default InputField;
