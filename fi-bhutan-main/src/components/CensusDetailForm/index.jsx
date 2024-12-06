import { Button, Col, Form, Row, Table, Tabs,DatePicker } from "antd";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SideBarContainer from "../../containers/SideBar";
import withDhis2FormItem from "../../hocs/withDhis2Field";
import CFormControl from "../CustomAntForm/CFormControl";
import InputField from "../CustomAntForm/InputField";
import moment from "moment";
import { DateField} from "./inputs/index";


/* style */
import "./index.css";

const CensusDetailForm = ({
  onSubmit,
  selected6Month,
  onTabChange,
  values,
}) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const dataElements = useSelector(
    (state) => state.metadata.programMetadata.programStages[0].dataElements
  );
  
  const Dhis2FormItem = useMemo(
    () => withDhis2FormItem(dataElements)(CFormControl),
    [dataElements]
  );

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(values);
  }, [values]);

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

  const sumOf = (target, fields) => {
    return {
      dependentFields: fields,
      setValuesFunc: (values) => {
        const sum = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        return {
          [target]: sum,
        };
      },
      childPropsFunc: ([]) => {
        return {
          disabled: true,
        };
      },
    };
  };

  const dependenciesOf = (target) => {
    return {
      skFDIWZmgTC: {
        dependentFields: ["skFDIWZmgTC"],
        // showFieldFunc: ([skFDIWZmgTC]) => skFDIWZmgTC != 0,
        setValuesFunc: ([skFDIWZmgTC]) => {
          if (skFDIWZmgTC <= 0) {
            return {
              [target]: "",
            };
          }
        },
        childPropsFunc: ([skFDIWZmgTC]) => {
          return {
            disabled: skFDIWZmgTC <= 0,
          };
        },
      },
      ztDjhjZoEGe: {
        dependentFields: ["ztDjhjZoEGe"],
        // showFieldFunc: ([ztDjhjZoEGe]) => ztDjhjZoEGe != 0,
        setValuesFunc: ([ztDjhjZoEGe]) => {
          if (ztDjhjZoEGe <= 0) {
            return {
              [target]: "",
            };
          }
        },
        childPropsFunc: ([ztDjhjZoEGe]) => {
          return {
            disabled: ztDjhjZoEGe <= 0,
          };
        },
      },
      QteYoL0Yy6K: {
        dependentFields: ["QteYoL0Yy6K"],
        // setValuesFunc: ([QteYoL0Yy6K]) => {
        //   if (QteYoL0Yy6K <= 0) {
        //     return {
        //       [target]: "",
        //     };
        //   }
        // },
        // childPropsFunc: ([QteYoL0Yy6K]) => {
        //   return {
        //     disabled: QteYoL0Yy6K <= 0,
        //   };
        // },
      },
    };
  };

  /**
 * <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Non-biodegradable household solid
                    waste (glass, blades, expired medicine, bandages, etc.) disposal method used</td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Public garbage collection
                </td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="fkAXYJ8nOll"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Open Pit</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="hwCISmocKY6"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Burning</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="f28Es6U3KSr"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Burial
                </td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="lSzJofGb7fU"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Others</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="vapo8mgKcyM"></td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Sanitation</td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Proper drainage</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="spZ0rGykIK6">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Livestock without separate animal-shed</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="nFFkSQtqGqL">
                </td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Facility accessibility and income
                </td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Using the usual means, how long does it take to
                    get to the nearest facility in minutes?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="ezLCrmL40SD">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">What was your household’s TOTAL INCOME
                    (collective
                    for all members and all sources: salaries, wages, pension, farm produce, dairy, forest products,
                    zorig
                    chusum, remittance, kidu, business, real state, rental, etc ) last year?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="Cql7XO3Z5Fe"></td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Malaria endemic specific questions
                </td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Does your household have Long Lasting Insecticide
                    Nets (LLIN) received last year?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="GtSSMCc6nXz">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of LLINs received last year</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="Ojvu6krZKBX"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Did anyone in your household sleep under LLINs
                    last night?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="WTFyAoDjI4X"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of U5 children who slept under LLINs last
                    night</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="S4G690Rx8KD"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of pregnant women who slept under LLINs last
                    night</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="FL0F1NaV4e2"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">No. of other members who slept under LLINs last
                    night</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="b60lyh4IRgb"></td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Was your house sprayed with IRS last year?</td>
                <td><input type="text" style="width:100%; box-sizing: border-box;" placeholder="uMRfJEDErNx"></td>
            </tr>
        </tbody>
        <thead>
            <tr aria-colspan="2">
                <td colspan="3"></td>
            </tr>
            <tr style="text-align:left;">
                <td colspan="2" style="border:1px solid black;background:#b9ecfd;">Salt Test</td>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">Household salt Iodine content</td>
                <td><input type="text" style="box-sizing: border-box;" placeholder="YGisOzETviK">
                </td>
            </tr>
            <tr style="text-align:left;">
                <td style="border:1px solid black;background:#b9ecfd;">If less than15 PPM specify the brand of salt</td>
                <td><input type="text" style="box-sizing: border-box;" placeholder="pUnhWS1qOeS">
                </td>
            </tr>
        </tbody>
    </table>
 */

  const tableRenderData = [
    // Household Status
    {
      type: "title",
      name: "Household Status",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Household Status",
      uid: "NPb0hOBn6g9",
      styles: {},
    },

    // Water and Sanitation
    {
      type: "title",
      name: "Water and Sanitation",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Are household members often exposed to Household Air Pollution from the inefficient combustion of solid fuels (i.e. wood, coal, charcoal, crop waste, dung) and kerosene used for cooking including animal feeds, heating or lighting the house?",
      uid: "d4DgS6Tv3uG",
      styles: {},
    },
    {
      type: "data",
      name: "What is the MAIN source (point of collection) of drinking water for members of your household?",
      uid: "a0t6coJR4bG",
      styles: {},
    },
    {
      type: "data",
      name: "Where is that water source (point of collection) located?",
      uid: "lRVDgo5HwYe",
      styles: {},
    },
    {
      type: "data",
      name: "How long does it take to go there, get water (queue for water and fill containers), and come back?",
      uid: "ADGaCK23IbP",
      styles: {},
    },
    {
      type: "data",
      name: "In the last month, has there been any time when your household did not have sufficient quantities of drinking water when needed?",
      uid: "ABBZkh32owZ",
      styles: {},
    },
    {
      type: "data",
      name: "What kind of toilet facility do members of your household usually use?",
      uid: "JT2QvZDPRAy",
      styles: {},
    },
    {
      type: "data",
      name: "Do you share this facility with others who are not members of your household?",
      uid: "rlecl6N9HcX",
      styles: {},
    },
    {
      type: "data",
      name: "Has your (pit latrine or septic tank) been emptied last year?",
      uid: "ySLtaPSULVN",
      styles: {},
    },
    {
      type: "data",
      name: "The last time it was emptied, where were the contents emptied?",
      uid: "RIqHmgT1OWu",
      styles: {},
    },
    {
      type: "data",
      name: "Can you please show me where members of your household most often wash their hands?",
      uid: "R0AYFvHFg6u",
      styles: {},
    },
    {
      type: "data",
      name: "Observe availability of water at the place for handwashing. (Note: Verify by checking the tap/pump, or basin, bucket, water container or similar objects for presence of water.)",
      uid: "d4VMT4orArm",
      styles: {},
    },
    {
      type: "data",
      name: "Observe availability of soap or detergent at the place for handwashing",
      uid: "Ju3AkdRHT52",
      styles: {},
    },

    // Biodegradable household solid waste (cooked food, vegetables, fruit, leaves, etc.) disposal method used
    {
      type: "title",
      name: "Biodegradable household solid waste (cooked food, vegetables, fruit, leaves, etc.) disposal method used",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Composting",
      uid: "SgyzeqQpg6V",
      styles: {},
    },
    {
      type: "data",
      name: "Animal feeds (e.g., food or vegetables wastes)",
      uid: "F0DV8pEPF98",
      styles: {},
    },
    {
      type: "data",
      name: "Public garbage collection",
      uid: "nz1hyyrSn4k",
      styles: {},
    },
    {
      type: "data",
      name: "Open Pit",
      uid: "vP0NGw6z3Mh",
      styles: {},
    },
    {
      type: "data",
      name: "Others",
      uid: "wbLpz0ADrJv",
      styles: {},
    },

    // Recyclable household solid waste (paper, cartons, cans, metallic items, bottles, etc.) disposal method used
    {
      type: "title",
      name: "Recyclable household solid waste (paper, cartons, cans, metallic items, bottles, etc.) disposal method used",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Recycling or reusing (including scrape dealers)",
      uid: "ua9PvkeM7iH",
      styles: {},
    },
    {
      type: "data",
      name: "Public garbage collection",
      uid: "haBuqhxXffw",
      styles: {},
    },
    {
      type: "data",
      name: "Burning",
      uid: "Og4wEm4Z7OV",
      styles: {},
    },
    {
      type: "data",
      name: "Open Pit",
      uid: "CWDcKbFmFty",
      styles: {},
    },
    {
      type: "data",
      name: "Others",
      uid: "DenbY2uVxeR",
      styles: {},
    },

    // Non-biodegradable household solid waste (glass, blades, expired medicine, bandages, etc.) disposal method used
    {
      type: "title",
      name: "Non-biodegradable household solid waste (glass, blades, expired medicine, bandages, etc.) disposal method used",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Public garbage collection",
      uid: "fkAXYJ8nOll",
      styles: {},
    },
    {
      type: "data",
      name: "Open Pit",
      uid: "hwCISmocKY6",
      styles: {},
    },
    {
      type: "data",
      name: "Burning",
      uid: "f28Es6U3KSr",
      styles: {},
    },
    {
      type: "data",
      name: "Burial",
      uid: "lSzJofGb7fU",
      styles: {},
    },
    {
      type: "data",
      name: "Others",
      uid: "vapo8mgKcyM",
      styles: {},
    },

    // Sanitation
    {
      type: "title",
      name: "Sanitation",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Proper drainage",
      uid: "spZ0rGykIK6",
      styles: {},
    },
    {
      type: "data",
      name: "Livestock without separate animal-shed",
      uid: "nFFkSQtqGqL",
      styles: {},
    },

    // Facility accessibility and income
    {
      type: "title",
      name: "Facility accessibility and income",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Using the usual means, how long does it take to get to the nearest facility in minutes?",
      uid: "ezLCrmL40SD",
      styles: {},
    },
    {
      type: "data",
      name: "What was your household’s TOTAL INCOME (collective for all members and all sources: salaries, wages, pension, farm produce, dairy, forest products, zorig chusum, remittance, kidu, business, real state, rental, etc ) last year?",
      uid: "Cql7XO3Z5Fe",
      styles: {},
    },

    // Malaria endemic specific questions
    {
      type: "title",
      name: "Malaria endemic specific questions",
      styles: {},
    },
    {
      type: "data",
      name: "Does your household have Long Lasting Insecticide Nets (LLIN) received last year?",
      uid: "GtSSMCc6nXz",
      styles: {},
    },
    {
      type: "data",
      name: "No. of LLINs received last year",
      uid: "Ojvu6krZKBX",
      styles: {},
    },
    {
      type: "data",
      name: "Did anyone in your household sleep under LLINs last night?",
      uid: "WTFyAoDjI4X",
      styles: {},
    },
    {
      type: "data",
      name: "No. of U5 children who slept under LLINs last night",
      uid: "S4G690Rx8KD",
      styles: {},
    },
    {
      type: "data",
      name: "No. of pregnant women who slept under LLINs last night",
      uid: "FL0F1NaV4e2",
      styles: {},
    },
    {
      type: "data",
      name: "No. of other members who slept under LLINs last night",
      uid: "b60lyh4IRgb",
      styles: {},
    },
    {
      type: "data",
      name: "Was your house sprayed with IRS last year?",
      uid: "uMRfJEDErNx",
      styles: {},
    },

    // Salt Test
    {
      type: "title",
      name: "Salt Test",
      styles: { fontWeight: "bold" },
    },
    {
      type: "data",
      name: "Household salt Iodine content",
      uid: "YGisOzETviK",
      styles: {},
    },
    {
      type: "data",
      name: "If less than15 PPM specify the brand of salt",
      uid: "pUnhWS1qOeS",
      styles: {},
    },
  ];

  const dependentFields = tableRenderData.map((d) => d.uid);

  const dataSource = tableRenderData.map((row, index) => {
    const {
      uid,
      some,
      alot,
      thirdRowTitle,
      thirdRowId,
      name,
      type,
      dependentFields = [],
      setValuesFunc = () => {},
      showFieldFunc = () => true,
      childPropsFunc = () => {},
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
                dependentFields={dependentFields}
                setValuesFunc={setValuesFunc}
                showFieldFunc={showFieldFunc}
                childPropsFunc={childPropsFunc}
              >
                <InputField size="small" style={{ minWidth: 120 }} />
              </Dhis2FormItem>
            ),
          };
        } else {
          return {
            ...row,
            key: index,
            label: name,
            input1: (
              <Dhis2FormItem displayFormName={t("some")} id={some}>
                <InputField size="small" />
              </Dhis2FormItem>
            ),
            input2: (
              <Dhis2FormItem displayFormName={t("alot")} id={alot}>
                <InputField size="small" />
              </Dhis2FormItem>
            ),
            input3: (
              <Dhis2FormItem displayFormName={t(thirdRowTitle)} id={thirdRowId}>
                <InputField size="small" />
              </Dhis2FormItem>
            ),
          };
        }
      }
    }
  });

  // const items = [
  //   {
  //     key: 1,
  //     label:'',
  //     // label: `${t("month")} 1-6`,
  //     children: (
  //       <Table
  //         size="small"
  //         bordered
  //         pagination={false}
  //         showHeader={false}
  //         dataSource={dataSource} 
  //         columns={columns} 
  //       />
  //     ),
    // {
    //   key: 2,
    //   label: `${t("month")} 7-12`,
    //   children: (
    //     <Table
    //       size="small"
    //       bordered
    //       pagination={false}
    //       showHeader={false}
    //       dataSource={dataSource}
    //       columns={columns}
    //     />
    //   ),
  //   },
  // ];

  const items = [
    {
      key: 2,
      label: '',
      children: (
        <>
         <DatePicker
            value={value ? moment(value) : null}
            onChange={(dateObject) => {
              onChange(dateObject.format("YYYY-MM-DD"));
            }}
          />

          
          <Table
            size="small"
            bordered
            pagination={false}
            showHeader={false}
            dataSource={dataSource} 
            columns={columns} 
          />
        </>
      ),
    },
  ];
  

  return (
    <Form
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

        <Col className="rightBar">
          <Tabs
            defaultActiveKey="1"
            size="small"
            items={items}
            onChange={onTabChange}
          />
        </Col>
      </div>
    </Form>
  );
};
export default CensusDetailForm;