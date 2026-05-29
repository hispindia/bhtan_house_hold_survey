import React from "react";
import { Input, Radio, Checkbox, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(weekday);
dayjs.extend(localeData);

import "./index.css";
const { TextArea } = Input;
const { Option } = Select;

const InputField = (props) => {
  const {
    label,
    error,
    helper,
    warning,
    value,
    valueType,
    valueSet,
    click,
    addonBefore,
    onChange,
    disabled,
    addonAfter,
    inputRef,
    id,
  } = props;

  const format = "YYYY-MM-DD";

  // console.log('first', id, props)
  const generateField = () => {
    if (valueSet) {
      return (
        <Select
          id={id}
          disabled={disabled}
          value={value}
          allowClear
          showSearch
          style={{ width: "100%" }}
          onChange={(selected) => {
            onChange(selected);
          }}
        >
          {valueSet.map((set) => (
            <Option value={set.value}>{set.label}</Option>
          ))}
        </Select>
      );
    }
    switch (valueType) {
      case "INTEGER_POSITIVE":
      case "INTEGER_NEGATIVE":
      case "INTEGER_ZERO_OR_POSITIVE":
      case "PERCENTAGE":
      case "NUMBER":
      case "INTEGER":
      case "PHONE_NUMBER":
        return (
          <Input
            id={id}
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            type="number"
            value={value || ""}
            onClick={click}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            disabled={disabled}
            // ref={inputRef}
          />
        );

      case "TEXT":

      // case "INTEGER_POSITIVE":
      // case "INTEGER_NEGATIVE":
      // case "INTEGER_ZERO_OR_POSITIVE":
      // case "PERCENTAGE":
      // case "NUMBER":
      // case "INTEGER":
      // case "PHONE_NUMBER":
      case "EMAIL":
        return (
          <Input
            id={id}
            type="text"
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            value={value || ""}
            onClick={click}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            disabled={disabled}
            // ref={inputRef}
          />
        );
      case "LONG_TEXT":
        return (
          <TextArea
            id={id}
            disabled={disabled}
            value={value || ""}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
        );
      case "DATE":
        return (
          <DatePicker
            id={id}
            // value={value ? dayjs(value) : ""}
            defaultValue={
              value && dayjs(value, format).isValid()
                ? dayjs(value, format)
                : null
            }
            onChange={(momentObject) => {
              momentObject && onChange(momentObject.format("YYYY-MM-DD"));
            }}
          />
        );
      case "AGE":
        return (
          <DatePicker
            id={id}
            // value={value ? dayjs(value) : ""}
            defaultValue={
              value && dayjs(value, format).isValid()
                ? dayjs(value, format)
                : null
            }
            onChange={(momentObject) => {
              onChange(momentObject);
            }}
          />
        );
      case "DATETIME":
        return <div>hello</div>;
      case "TIME":
        return <div>hello</div>;
      case "BOOLEAN":
        return (
          <Radio.Group
            id={id}
            disabled={disabled}
            value={value}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          >
            <Radio value="true" style={{ fontSize: "13.5px" }}>
              Yes
            </Radio>
            <Radio value="false" style={{ fontSize: "13.5px" }}>
              No
            </Radio>
          </Radio.Group>
        );
      case "TRUE_ONLY":
        return (
          <Checkbox
            id={id}
            checked={value}
            onChange={(event) => {
              onChange(event.target.checked);
            }}
            disabled={disabled}
          ></Checkbox>
        );
      case "COORDINATE": {
        return (
          <input
            // type="text"
            // className="w-full border rounded-lg p-2 pr-10"
            id={id}
            type="text"
            addonBefore={addonBefore}
            addonAfter={addonAfter}
            value={value || ""}
            onClick={click}
            onChange={(event) => {
              onChange(event.target.value);
            }}
            disabled={disabled}
          />
        );
      }
  //     case "ORGANISATION_UNIT":
  // return (
  //   <div>
  //     <Input
  //       type="text"
  //       value={value?.label || ""}
  //       placeholder="[Please select]"
  //       readOnly
  //       disabled={disabled}
  //     />

  //     <OrgUnitSelector
  //       singleSelection={true}
  //       selectedOrgUnit={value}
  //       handleSelectOrgUnit={(selected) => {
  //         const selectedId = selected?.selected?.[0];

  //         onChange({
  //           selected: selected.selected,
  //           label: selectedId || "",
  //         });
  //       }}
  //       filter={props.filter}
  //     />
  //   </div>
  // );

      default:
        return <span>UNSUPPORTED VALUE TYPE</span>;
    }
  };

  return (
    <div className="input-container">
      {label && <div className="input-label">{label}</div>}
      <div className="input-field">{generateField()}</div>
      {error && <div className="input-error">{error}</div>}
      {helper && <div className="input-helper">{helper}</div>}
      {warning && <div className="input-warning">{warning}</div>}
    </div>
  );
};

export default InputField;
