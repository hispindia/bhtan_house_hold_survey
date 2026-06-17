import SideBarContainer from "@/containers/SideBar";
import withDhis2FormItem from "@/hocs/withDhis2Field";
import useHouseholdSurveyForm from "@/hooks/useHouseholdSurveyForm";
import { Button, Col, Form, Row, Table, Tabs } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import CFormControl from "../CustomAntForm/CFormControl";
import InputField from "../InputField";
import SavingIndicator from "./SavingIndicator";

/* style */
import { debounce } from "lodash";
import "./index.css";
import { submitAttributes } from "@/redux/actions/data";

const CensusDetailForm = ({ onSubmit, onTabChange, values }) => {
  const dataElements = useSelector(
    (state) => state.metadata.programMetadata.programStages[0].dataElements
  );
  const events = useSelector((state) => state.data.tei.data.currentEvents);
  const submitEventLoading = useSelector(
    (state) => state.data.tei.submitEventLoading
  );
  const attributes = useSelector((state) => state.data.tei.data.currentTei?.attributes);
  const dispatch = useDispatch();
  const Dhis2FormItem = useMemo(
    () => withDhis2FormItem(dataElements)(CFormControl),
    [dataElements]
  );
  const { form, surveyList, loadServeyFields } = useHouseholdSurveyForm(values);

  const { t } = useTranslation();
  const [formData, setFormData] = useState({});

  const columns = [
    {
      dataIndex: "label",
      key: "label",
      render: (value, row, index) => {
        const { type, styles } = row;
        return {
          children: value,
          props: {
            colSpan: type === "title" ? 4 : 1,
            style: styles,
          },
        };
      },
    },
    {
      dataIndex: "input1",
      key: "input1",
      render: (value, row, index) => {
        return {
          children: value,
          props: {
            colSpan: getInputRowSpan(row, true),
          },
        };
      },
    },
    {
      dataIndex: "input2",
      key: "input2",
      render: (value, row, index) => {
        return {
          children: value,
          props: {
            colSpan: getInputRowSpan(row),
          },
        };
      },
    },
    {
      dataIndex: "input3",
      key: "input3",
      render: (value, row, index) => {
        return {
          children: value,
          props: {
            colSpan: getInputRowSpan(row),
          },
        };
      },
    },
  ];

  const getInputRowSpan = (row, isFirstInput = false) => {
    const { type, uid } = row;
    return type === "title" ? 0 : uid ? (isFirstInput ? 3 : 0) : 1;
  };

  const handleFormData = (id, value) => {
    console.log("handleFormData:>>>", id, value);
    setFormData({ ...formData, [id]: value });
  };

  const handleChange = debounce((event) => {
    loadServeyFields(event);
    form
      .validateFields()
      .then((fieldsValue) => {
        onSubmit(fieldsValue);
      })
      .catch((error) => {
        console.log("Validation errors on change:", error);
      });
  }, 1000);

  useEffect(() => {
    loadServeyFields();
  }, []);

  const dataSource = surveyList.map((row, index) => {
    const {
      uid,
      some,
      alot,
      thirdRowTitle,
      thirdRowId,
      name,
      type,
      hidden,
      permanentHide,
      dependentFields = [],
      setValuesFunc = () => { },
      showFieldFunc = () => true,
      childPropsFunc = () => { },
    } = row;
    switch (type) {
      case "title": {
        return {
          ...row,
          key: index,
          label: name,
        };
      }
      default: {
        if (uid) {
          return {
            ...row,
            key: index,
            label: name,
            input1: (
              <Dhis2FormItem
                noStyle
                id={uid}
                value={formData[uid] || ""}
                hidden={permanentHide == true ? true : hidden}
                dependentFields={dependentFields}
                setValuesFunc={setValuesFunc}
                showFieldFunc={showFieldFunc}
                childPropsFunc={childPropsFunc}
              >
                <InputField size="small" style={{ minWidth: "100%" }} />
              </Dhis2FormItem>
            ),
          };
        } else {
          return {
            ...row,
            key: index,
            label: name,
            input1: (
              <Dhis2FormItem
                hidden={hidden}
                displayFormName={t("some")}
                id={some}
              >
                <InputField
                  value={formData[uid] || ""}
                  hidden={permanentHide == true ? true : hidden}
                  size="small"
                />
              </Dhis2FormItem>
            ),
            input2: (
              <Dhis2FormItem
                hidden={hidden}
                displayFormName={t("alot")}
                id={alot}
              >
                <InputField
                  value={formData[uid] || ""}
                  hidden={permanentHide == true ? true : hidden}
                  size="small"
                />
              </Dhis2FormItem>
            ),
            input3: (
              <Dhis2FormItem
                hidden={hidden}
                displayFormName={t(thirdRowTitle)}
                id={thirdRowId}
              >
                <InputField
                  value={formData[uid] || ""}
                  hidden={permanentHide == true ? true : hidden}
                  size="small"
                />
              </Dhis2FormItem>
            ),
          };
        }
      }
    }
  });

  const items = [
    {
      key: 1,
      label: ``,
      children: (
        <div style={{ position: "relative" }}>
          <SavingIndicator loading={submitEventLoading} />
          <Table
            size="small"
            bordered
            pagination={false}
            showHeader={false}
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      ),
    },
  ];

  // onFieldsChange={debounce(loadServeyFields, 1000)}
  //     initialValues={values}
  //     form={form}
  //     onFinish={(fieldsValue) => {
  //       onSubmit(fieldsValue);
  //     }}

  return (
    <Form
      onFieldsChange={handleChange}
      initialValues={values}
      form={form}
      onFinish={(fieldsValue) => {
        onSubmit(fieldsValue);
      }}
    >
      <div className="d-md-flex">
        <Col className="leftBar mr-2 mt-2">
          <SideBarContainer />

          <Row justify="center">
            <Button
              type="primary"
              htmlType="submit"
              className="mt-2"
              style={{
                width: "100%",
                backgroundColor: "#4CAF50",
              }}
            >
              {t("save")}
            </Button>
          </Row>
        </Col>

        {events && events.length > 0 ? (
          <Col className="rightBar">
            <Tabs
              defaultActiveKey="1"
              size="small"
              items={items}
              onChange={onTabChange}
            />
            <Button
              type="primary"
              className="mt-2"
              onClick={() => {
                console.log("values before submit", values);
                if (!values?.tjXaQPI9OcQ) {
                  return alert("Please select Household Survey Date");
                }
                // if (values?.tjXaQPI9OcQ) {
                //   if (attributes?.RhN4IqcEqz9 !== "true" && attributes?.RhN4IqcEqz9 !== true) {
                //     const updatedAttributes = {
                //       ...attributes,
                //       RhN4IqcEqz9: true,
                //     };
                //     dispatch(submitAttributes(updatedAttributes));
                //   }
                // }  
                if (
                  values?.XzNHbMtGHIR === undefined ||
                  values?.XzNHbMtGHIR === null ||
                  values?.XzNHbMtGHIR === ""
                ) {
                  return alert("Please select a value for Data verified");
                }

                if (values?.XzNHbMtGHIR === "true") {
                  const updatedAttributes = {
                    ...attributes,
                    RhN4IqcEqz9: true,
                  };

                  dispatch(submitAttributes(updatedAttributes));
                }

                if (values?.XzNHbMtGHIR === "false") {
                  const updatedAttributes = { ...attributes };

                  // Remove the attribute completely
                  delete updatedAttributes.RhN4IqcEqz9;

                  dispatch(submitAttributes(updatedAttributes));
                }

                onSubmit(values);
              }}
              style={{
                width: "10%",
                backgroundColor: "#4CAF50",
              }}
            >
              {t("save")}
            </Button>
          </Col>
        ) : (
          <div className="text-center mt-5">
            <h5>Please add new Year for entering data</h5>
          </div>
        )}
      </div>
    </Form>
  );
};

export default CensusDetailForm;
