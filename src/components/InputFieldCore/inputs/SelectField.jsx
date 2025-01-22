import { useTranslation } from "react-i18next";
import Select from "react-select";

const SelectField = (
  { valueSet, value, handleChange, handleBlur, locale, disabled },
  props
) => {
  const { t } = useTranslation();

  const options = valueSet.map((e) => {
    e.label = locale
      ? locale != "en"
        ? e.translations[locale]
        : e.label
      : e.label;
    return e;
  });

  return (
    <Select
      value={value}
      isDisabled={disabled}
      isClearable={true}
      options={options}
      placeholder={value ? value : t("select")}
      onChange={(selected) => {
        if (!selected) {
          handleChange(null);
          handleBlur && handleBlur(null);
          return;
        }

        handleChange(selected.value);
        handleBlur && handleBlur(selected.value);
      }}
      styles={{
        control: (provided) => ({
          ...provided,
          height: 40,
        }),
      }}
    />
  );
};

export default SelectField;
