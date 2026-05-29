import _ from "lodash";
import "./InputField.styles.css";
import propTypes from "./InputField.types.js";
import { DateField, OrgUnitField, SelectField, TextField } from "./inputs/index";
import { onKeyDown } from "@/utils";
import { useTranslation } from "react-i18next";
import { Input } from "antd";

const { TextArea } = Input;

const InputField = ({
  valueType,
  valueSet,
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
  attribute = null,
  onInput,
  ...props
}) => {
  const { t } = useTranslation();

  const generateSelectFieldValue = (valueSet, value) => {
    const v = valueSet.find((currentValue) => currentValue.value === value);
    return v ? v : null;
  };

  const generateInput = () => {
    if (valueSet) {
      return (
        <SelectField
          valueSet={valueSet}
          locale={locale}
          value={generateSelectFieldValue(valueSet, value)}
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
          valueSet={valueSet}
          value={value}
          locale={locale}
          handleBlur={onBlur}
          handleChange={onChange}
          disabled={disabled}
          valueType={valueType}
          {...props}
        />
      );
    }
    if (valueType === "BOOLEAN") {
      const vs = [
        { value: "true", label: t("yes") },
        { value: "false", label: t("no") },
      ];
      return (
        <SelectField
          value={generateSelectFieldValue(vs, value)}
          valueSet={vs}
          handleBlur={onBlur}
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

      case "LONG_TEXT":
        return (
          <TextArea
            value={value}
            onChange={(ev) => onChange(ev?.target?.value ?? "")}
            // onChange={onChange}
            onBlur={(ev) => onBlur(ev?.target?.value ?? "")}
            disabled={disabled}
            {...props}
          />
        );
      case "TEXT":
      case "PERCENTAGE":
      case "PHONE_NUMBER":
      case "EMAIL":
      case "COORDINATE":
        return (
          <Input
            type="text"
            value={value}
            // handleChange={onChange}
            // handleBlur={onBlur}
            onChange={(ev) => onChange(ev?.target?.value ?? "")}
            onBlur={(ev) => onBlur(ev?.target?.value ?? "")}
            disabled={disabled}
            {...props}
          />
        );
      
      case "ORGANISATION_UNIT": {
        return (
          <OrgUnitField
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            filter={props.filter}
            {...props}
          />
        );
      }
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
    <div
      className="input-field-container"
      data-element-id={props["data-element-id"]}
    >
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
