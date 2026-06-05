import { InputAdornment } from "@material-ui/core";
import _ from "lodash";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import useForm from "../../hooks/useForm";
import { FORM_ACTION_TYPES } from "../constants";

// components
import { useTranslation } from "react-i18next";
import InputField from "../InputFieldCore/InputField.component.jsx";

CaptureForm.defaultProps = {
  maxDate: new Date(),
};

function CaptureForm(props) {
  const { t } = useTranslation();

  const {
    classes,
    className,
    // metadata,
    data,
    rowIndex,
    formStatus,
    setFormStatus,
    handleEditRow,
    handleAddNewRow,
    editRowCallback = null,
    locale,
    allowFormEditable,
    handleSaveButton,
    dialogControl,
    onCloseModal,
    ...other
  } = props;
  const { formData, prevData, setFormData, changeValue, initFromData, validation, onSubmit, clear } = useForm(data, {
    compulsory: t("thisFieldIsRequired"),
  });

  const formAttrMetaData = useSelector((state) => state.metadata?.formMetaData || []);

  useEffect(() => {
    initFromData(data);
  }, [data.id]);

  useEffect(() => {
    return () => {
      console.log("Cascade form unmounted");
      clear();
    };
  }, []);

  const editCall = (formAttrMetaData, prevData, formData, code, value, sectionKey) => {
    let data = _.clone(formData);

    editRowCallback(formAttrMetaData, prevData, data, code, value, sectionKey);
    setFormData({ ...data });

    const submitType = formStatus === FORM_ACTION_TYPES.ADD_NEW ? "add" : "edit";
    handleOnSubmit(null, submitType, false); // Pass false for onBlur events
  };

  const generateFields = (formMetaData, sectionKey) => {
    return Object.keys(formMetaData)
      .filter((f) => !formMetaData[f].hidden)
      .map((item) => {
        let f = formMetaData[item];
        return (
          <div className="col-lg-3 mb-3" key={f.code}>
            <InputField
              id={f.id}
              disabled={f.permanentDisabled == true ? true : f.disabled}
              locale={locale}
              {...(_.has(f, "periodType") && {
                periodType: f.periodType,
              })}
              valueSet={f.valueSet}
              pattern={f.pattern}
              valueType={f.valueType}
              label={!_.isEmpty(f.translations) ? f.translations[locale] : f.displayFormName}
              attribute={f.attribute}
              value={formData[f.code] || ""}
              onBlur={(value) => editCall(formAttrMetaData, prevData.current, formData, f.code, value, sectionKey)}
              onChange={(value) => {
                changeValue(f.code, value);
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">{f.prefix}</InputAdornment>,
              }}
              error={validation(f.code)}
              maxDate={props.maxDate}
              minDate={"1900-12-31"}
              data-element-id={f.code}
              onCloseModal={onCloseModal}
            />
          </div>
        );
      });
  };

  const handleCancelForm = () => {
    setFormStatus(FORM_ACTION_TYPES.NONE);
    dialogControl.close();
  };

  const handleOnSubmit = (e, action, shouldReload) => {
    let status = onSubmit(null);

    if (status) {
      switch (action) {
        case "add":
          handleAddNewRow(e, formData, false);
          break;
        case "edit":
          let row = _.clone(formData);
          handleEditRow(e, row, rowIndex);
          break;
      }

      shouldReload ? dialogControl.close() : null;

      handleSaveButton(shouldReload);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          {Object.keys(formAttrMetaData)
            .filter((f) => !formAttrMetaData[f].additionCol)
            .filter((f) => !formAttrMetaData[f].hidden)
            .map((mItem) => {
              return (
                <div className="row" key={mItem}>
                  <div class="card-body">
                    <h5 class="card-title">{mItem}</h5>
                    <p class="card-text">
                      <div className="row">{generateFields(formAttrMetaData[mItem].fields, mItem)}</div>
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="row">
        <div className="col-md-12">
          <div className="btn-toolbar" role="toolbar">
            <div className="btn-group mr-2" role="group" aria-label="First group">
              <button type="button" className="btn btn-success" onClick={(e) => handleOnSubmit(e, "edit", true)}>
                {t("save")}
              </button>
            </div>
            {formStatus !== FORM_ACTION_TYPES.NONE && (
              <div className="btn-group mr-2" role="group" aria-label="First group">
                <button type="button" className="btn btn-light" onClick={(e) => handleCancelForm()}>
                  {t("cancel")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

CaptureForm.propTypes = {};

export default CaptureForm;
