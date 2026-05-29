import { metadataApi } from "@/api";
import tableRenderData from "@/components/CensusDetailForm/houseServey";
import { Form } from "antd";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useHouseholdSurveyForm = (values) => {
  const [form] = Form.useForm();
  const [surveyList, setSurveyList] = useState([]);

  const hideForMaleria = [
    "GtSSMCc6nXz",
    "Ojvu6krZKBX",
    "WTFyAoDjI4X",
    "S4G690Rx8KD",
    "FL0F1NaV4e2",
    "b60lyh4IRgb",
    "uMRfJEDErNx",
    "rWCn0WGoAeS",
  ];

  const selectedOuPath = useSelector((state) => state.metadata.selectedOrgUnit.path);

  useEffect(() => {
    (async () => {
      try {
        const output = await metadataApi.getOUListForMaleria();
        output.organisationUnits.forEach((item) => {
          if (selectedOuPath.includes(item.id)) {
            tableRenderData.forEach((item) => {
              if (hideForMaleria.includes(item.uid)) {
                item.permanentHide = false;
              }
            });
            return;
          }
        });
        setSurveyList(_.cloneDeep(tableRenderData));
      } catch (error) {
        console.error("API Error:await metadataApi.getOUListForMaleria", error);
      }
    })();
  }, []);

  useEffect(() => {
    form.resetFields();
    form.setFieldsValue(values);
    // load survey fields

    if (values["NPb0hOBn6g9"] == "Empty") {
      tableRenderData.forEach((item) => {
        if (item.uid != "NPb0hOBn6g9") {
          item.hidden = true;
        }
      });
    }
  }, [values]);

  function loadServeyFields(event = []) {
    // console.log('event:>>>', event)
    const uuid = event[0]?.name[0];
    const value = event[0]?.value;
    //validation for Negative value not enter 
    const NO_NEGATIVE_DATAELEMENTS = [

      "Ojvu6krZKBX",
      "WTFyAoDjI4X"
    ];
    if (event.length) {
      //validation for Negative value not enter 
      if (
        NO_NEGATIVE_DATAELEMENTS.includes(uuid) &&
        value !== null &&
        value !== "" &&
        !isNaN(value) &&
        Number(value) < 0
      ) {
        // Reset the value immediately
        form.setFieldsValue({ [uuid]: null });

        // Do NOT continue further logic
        return;
      }

      // ✅ Store valid value
      values[uuid] = value;
      //validation for Negative value not enter 
      values[uuid] = value;
      if (uuid == "NPb0hOBn6g9" && value == "Empty") {
        let keysToKeep = ["NPb0hOBn6g9", "tjXaQPI9OcQ"];

        tableRenderData.forEach((item) => {
          if (!keysToKeep.includes(item.uid)) {
            item.hidden = true;
          }
        });

        for (let key in values) {
          if (!keysToKeep.includes(key)) {
            values[key] = null;
          }
        }
        // values['NPb0hOBn6g9'] = value
        form.setFieldsValue(values);
      } else if (uuid == "a0t6coJR4bG") {
        let dwelling = ["Pipe in compound but outside the dwelling", "Piped in dwelling"];

        if (value == "Pipe in compound but outside the dwelling") {
          values["lRVDgo5HwYe"] = "In own compound, yard/plot";
          // values["ADGaCK23IbP"] = null
          // tableRenderData.forEach(item => {
          //     if (item.uid == 'ADGaCK23IbP') { item.hidden = true }
          // })
          form.setFieldsValue(values);
        } else if (value == "Piped in dwelling") {
          values["lRVDgo5HwYe"] = "In own dwelling";
          // values["ADGaCK23IbP"] = null;

          // tableRenderData.forEach(item => {
          //     if (item.uid == 'ADGaCK23IbP') { item.hidden = true }
          // })
          form.setFieldsValue(values);
        } else {
          // tableRenderData.forEach(item => {
          //     if (item.uid == 'ADGaCK23IbP') { item.hidden = false }
          // })
          // values["lRVDgo5HwYe"] = null;
          form.setFieldsValue(values);
        }
      } else if (uuid == "lRVDgo5HwYe") {
        console.trace("first");
        if (value != "Elsewhere") values["ADGaCK23IbP"] = "Less than or equal to 30 minutes";
        else values["ADGaCK23IbP"] = null;
        form.setFieldsValue(values);
      } else if (uuid == "YGisOzETviK") {
        // need to be chsanged'
        // console.trace('pppppppp');

        tableRenderData.forEach((item) => {
          if (item.uid == "pUnhWS1qOeS") {
            if (value == "No Iodine Detected") item.hidden = false;
            else item.hidden = true;
          }
        });
      } else if (uuid == "JT2QvZDPRAy") {
        const ifExist = [
          "Flush to septic tank",
          "Flush to pit latrine",
          "Ventilated improved pit",
          "Pit latrine with slab",
          "Pit latrine without slab",
          "Other improved toilet facility",
        ];
        if (value == "No facility/bush/field") {
          tableRenderData.forEach((item) => {
            if (item.uid == "ySLtaPSULVN" || item.uid == "RIqHmgT1OWu" || item.uid == "rlecl6N9HcX") {
              item.hidden = true;
            }
          });
          values["ySLtaPSULVN"] = null;
        }
        // else if (value == "Flush to piped sewer system") {
        //     tableRenderData.forEach(item => {
        //         if (item.uid == 'RIqHmgT1OWu') { item.hidden = true }
        //     })
        //     values["RIqHmgT1OWu"] = null;
        // }
        else if (ifExist.includes(value)) {
          tableRenderData.forEach((item) => {
            if (item.uid == "ySLtaPSULVN" || item.uid == "rlecl6N9HcX" || item.uid == "RIqHmgT1OWu") {
              item.hidden = false;
            }
          });
        } else if (!ifExist.includes(value)) {
          tableRenderData.forEach((item) => {
            if (item.uid == "ySLtaPSULVN" || item.uid == "RIqHmgT1OWu") {
              item.hidden = true;
            }
          });
          values["ySLtaPSULVN"] = null;
        } else {
          tableRenderData.forEach((item) => {
            if (item.uid == "ySLtaPSULVN" || item.uid == "RIqHmgT1OWu" || item.uid == "rlecl6N9HcX") {
              item.hidden = false;
            }
          });
        }
        form.setFieldsValue(values);
      } else if (uuid == "ySLtaPSULVN") {
        if (value == "Never emptied") {
          tableRenderData.forEach((item) => {
            if (item.uid == "RIqHmgT1OWu") {
              item.hidden = true;
            }
          });
          values["RIqHmgT1OWu"] = null;
        } else {
          tableRenderData.forEach((item) => {
            if (item.uid == "RIqHmgT1OWu") {
              item.hidden = false;
            }
          });
        }
        form.setFieldsValue(values);
      } else if (uuid == "b60lyh4IRgb") {
        console.log("qwertyui");
        if (value == "true") {
          tableRenderData.forEach((item) => {
            if (item.uid == "rWCn0WGoAeS") {
              item.permanentHide = true;
              item.hidden = true;
            }
          });
        } else {
          tableRenderData.forEach((item) => {
            if (item.uid == "rWCn0WGoAeS") {
              item.permanentHide = false;
              item.hidden = false;
            }
          });
        }
      } else if (uuid == "R0AYFvHFg6u") {
        let ifExist = ["No handwashing place in dwelling/yard/plot", "No permission to see", "Other reasons"];
        if (ifExist.includes(value)) {
          tableRenderData.forEach((item) => {
            if (item.uid == "d4VMT4orArm" || item.uid == "Ju3AkdRHT52") {
              item.hidden = true;
            }
          });
          values["d4VMT4orArm"] = null;
          values["Ju3AkdRHT52"] = null;
        } else {
          tableRenderData.forEach((item) => {
            if (item.uid == "d4VMT4orArm" || item.uid == "Ju3AkdRHT52") {
              item.hidden = false;
            }
          });
        }
        form.setFieldsValue(values);
      } else if (uuid == "GtSSMCc6nXz") {
        let ifExist = ["Ojvu6krZKBX", "WTFyAoDjI4X", "S4G690Rx8KD", "FL0F1NaV4e2", "b60lyh4IRgb", "rWCn0WGoAeS"];
        if (value == "false") {
          tableRenderData.forEach((item) => {
            if (ifExist.includes(item.uid)) {
              item.hidden = true;
            }
          });
          values["Ojvu6krZKBX"] = null;
          values["WTFyAoDjI4X"] = null;
          values["S4G690Rx8KD"] = null;
          values["FL0F1NaV4e2"] = null;
          values["b60lyh4IRgb"] = null;
          values["rWCn0WGoAeS"] = null;
        } else if (value != "false") {
          tableRenderData.forEach((item) => {
            if (ifExist.includes(item.uid)) {
              item.hidden = false;
            }
          });
        }
        form.setFieldsValue(values);
      } else if (uuid == "NPb0hOBn6g9" && value != "Empty") {
        tableRenderData.forEach((item) => {
          item.hidden = false;
        });
      }
      if (uuid == "tjXaQPI9OcQ" && value) {
        form.setFieldsValue({
          ...values,
          XzNHbMtGHIR: "true",
        });
      }

    }
    setSurveyList(_.cloneDeep(tableRenderData));
  }

  return {
    form,
    surveyList,
    loadServeyFields,
  };
};

export default useHouseholdSurveyForm;
