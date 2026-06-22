import CascadeTable from "@/components/CascadeTable";
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import i18n from "i18next";
import _ from "lodash";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";

/* REDUX */
import { useDispatch, useSelector } from "react-redux";

/* SELECTOR */
import { changeMember } from "../../redux/actions/data/tei";

// Import utils
import { calculateAgeGroup } from "./FormCalculationUtils";

// Styles
import { houseHoldMemberFormMetaData } from "@/redux/actions/metadata";
import { calculateAge } from "@/utils/event";
import { convertOriginMetadata } from "@/utils/formMetadeta";
import "../../index.css";
import {
  FAMILY_MEMBER_METADATA_CUSTOMUPDATE,
  FAMILY_MEMBER_VALUE,
  JURISDICTION_VALUE,
  HAS_INITIAN_NOVALUE,
  HHM2_ALCOHAL_CONSUMPTION12_MONTH,
  HHM2_ALCOHOL_CONSUMPTION,
  HHM2_ALCOHOL_CONSUMTION_FREQUENCY,
  HHM2_ARECANUT_CONSUMPTION,
  HHM2_ARECANUT_CONSUMPTION_FREQUENCY,
  HHM2_BLOODSUGER_MEASERD_SECTION,
  HHM2_BLOODSUGER_MEASERDBY_DOCTOR,
  HHM2_DIABETESDOCTOR_SECTION,
  HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR,
  HHM2_INTENSE_SPORTS,
  HHM2_MINS_CYCLING,
  HHM2_MODERATE_EXERTION,
  HHM2_PRENGENT,
  HHM2_SMOKED_TOBACCO_PRODUCTS,
  HHM2_SMOKING_FREQUENCY,
  HHM2_SPORTS_MODERATE_INTENSITY,
  HHM2_TABACCO_PRODUCTS_FREQUENCY,
  HHM2_TOBACCO_PRODUCTS,
  HHM2_WEEKLY_FRUIT_CONSUMTION,
  HHM2_WEEKLY_VEGETABLE_CONSUMTION,
  HHM2_WORK_RELATED_PHYSICAL_EXERTION,
  MEMBER_FORM_VALIDATIONS_SECTION,
  MOTHER_CHILD_CUSTOM_HIDE,
  TYPE_OF_ACTION
} from "../constants";
import styles from "./FamilyMemberForm.module.css";

const { familyMemberFormContainer, cascadeTableWrapper } = styles;
const LoadingCascadeTable = withSkeletonLoading()(CascadeTable);

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginTop: "5px",
  },
}));

const FamilyMemberForm = ({
  currentEvent,
  changeEventDataValue,
  changeEvent,
  blockEntry,
  events,
  externalComponents,
  setDisableCompleteBtn,
  handleSaveButton,
  ...props
}) => {
  const { t } = useTranslation();
  const classes = useStyles();

  const { year } = useSelector((state) => state.data.tei.selectedYear);
  const { programMetadataMember } = useSelector((state) => state.metadata);
  const originMetadata = convertOriginMetadata(programMetadataMember);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const currentCascade = useSelector((state) => state.data.tei.data.currentCascade);

  const [metadata, setMetadata] = useState(_.cloneDeep(originMetadata));

  const getCascadeData = () => {
    let cascadeData = [];
    if (currentCascade && currentCascade[year]) {
      cascadeData = currentCascade[year];
    }
    return cascadeData;
  };

  useEffect(() => {
    // load from redux
    setLoading(true);

    setData(getCascadeData());

    setLoading(false);
  }, [currentCascade]);

  useEffect(() => {
    (async () => { })();

    setLoading(true);

    let cascadeData = getCascadeData();

    setData(cascadeData);

    if (metadata) {
      let cloneMetadata = metadata.reduce((obj, md) => {
        obj[md.id] = md;
        return obj;
      }, {});

      setMetadata([...Object.values(cloneMetadata)]);
    }

    setLoading(false);
  }, [currentEvent]);

  const editRowCallback = (metadata, previousData, data, code, value, sectionKey, caseStop) => {
    // keep selected member details

    // Early return if metadata is not available
    if (!metadata || typeof metadata !== "object") {
      console.warn("Metadata is not available or invalid");
      return;
    }

    // Helper function to safely set hidden property
    const safeSetHidden = (section, field, hidden) => {
      try {
        if (!metadata || !section) return;
        if (!metadata[section]) {
          console.warn(`Metadata section not found: ${section}`);
          return;
        }
        if (field) {
          if (!metadata[section].fields) {
            console.warn(`Fields not found in section: ${section}`);
            return;
          }
          if (!metadata[section].fields[field]) {
            console.warn(`Field not found: ${field} in section: ${section}`);
            return;
          }
          metadata[section].fields[field].hidden = hidden;
        } else {
          metadata[section].hidden = hidden;
        }
      } catch (error) {
        console.error(`Error setting hidden for section: ${section}, field: ${field}`, error);
      }
    };

    // Helper function to safely iterate over fields
    const safeIterateFields = (section, callback) => {
      try {
        if (!metadata || !section) return;
        if (!metadata[section]) return;
        if (!metadata[section].fields) return;
        for (let i in metadata[section].fields) {
          if (metadata[section].fields[i]) {
            callback(i, metadata[section].fields[i]);
          }
        }
      } catch (error) {
        console.error(`Error iterating fields for section: ${section}`, error);
      }
    };

    if (!data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MEMBERSHIP_STATUS]) {
      safeSetHidden(
        MEMBER_FORM_VALIDATIONS_SECTION.MEMBERSHIP_STATUS,
        FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO,
        true
      );
    }

    if (!data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MEMBERSHIP_STATUS]) {
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2, null, true);

      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.DIET, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION_NCD, null, true);
      safeSetHidden(MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION, null, true);
      
    }

    switch (code) {

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO:
        const trasnferToSex = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX];
        const transferTo = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO];
        const transferToDOB = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB];
        const transferToAge = calculateAge(transferToDOB);
        if (!transferTo && (transferToAge || trasnferToSex)) break;

        if (
          trasnferToSex == TYPE_OF_ACTION.FEMALE &&
          transferToAge > 15 &&
          transferToAge < 49 &&
          transferTo == FAMILY_MEMBER_VALUE.EX_COUNTRY
        ) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = false;
        } else if (
          (trasnferToSex == TYPE_OF_ACTION.MALE && transferTo == FAMILY_MEMBER_VALUE.EX_COUNTRY) ||
          (trasnferToSex == TYPE_OF_ACTION.FEMALE && transferTo == FAMILY_MEMBER_VALUE.EX_COUNTRY)
        ) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].hidden = true;
           metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = false;
        } else if (transferTo == FAMILY_MEMBER_VALUE.IN_COUNTRY) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;
           metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = false;
        }

        else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = false;

          editRowCallback(
            metadata,
            previousData,
            data,
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB,
            data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB],
            sectionKey,
            true
          );

          editRowCallback(
            metadata,
            previousData,
            data,
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX,
            data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX],
            sectionKey,
            true
          );

          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].hidden = true;
        }

        break;
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MIGRATED_HHM:
        const migratedHH = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MIGRATED_HHM];
        if (migratedHH == JURISDICTION_VALUE.WITHIN_JURISDICTION) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].fields[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.NEW_HH_LOCATION_DETAILS].hidden = true;
        } else if (migratedHH == JURISDICTION_VALUE.OUTSIDE_JURISDICTION) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].fields[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MIGRATED_HHM_ORGUNIT].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].fields[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MIGRATED_HHM_ORGUNIT].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].fields[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.NEW_HH_LOCATION_DETAILS].hidden = false;


        }

        break;

      // handle form validation on besis of DOB
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB:
        const age = calculateAge(value);
        data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE] = age;
        const sex = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX];

        if (age > 14 && age < 50 && sex && sex == TYPE_OF_ACTION.FEMALE) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
          for (let i in metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields) {
            if (i == MOTHER_CHILD_CUSTOM_HIDE[4])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = true;
            else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = false;
          }
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;
        }

        if (age < 15 || age > 69) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;
          // return;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = false;
        }

        if (age > 4) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = false;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
        }

        if (age < 15) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.INDIVIDUAL_REGISTRATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACTIVITY_LAST6MONTH
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CURRENT_MARITAL_STATUS
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.INDIVIDUAL_REGISTRATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CONTECT_NUMBER
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACTIVITY_LAST6MONTH
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CURRENT_MARITAL_STATUS
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE
          ].hidden = false;
        }

        if (age < 2) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MORDEN_EDUCATION
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ATTENDING_TRADITIONAL_LERNING
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MORDEN_EDUCATION
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ATTENDING_TRADITIONAL_LERNING
          ].hidden = false;
        }

        if (age < 18 || age > 75) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = false;
        }

        if (age < 18) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = false;
        }

        if (!caseStop) {
          editRowCallback(
            metadata,
            previousData,
            data,
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO,
            data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO],
            sectionKey
          );
        }

        break;

      // handle form validation on besis of membership status
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.MEMBERSHIP_STATUS:
        switch (value) {
          case FAMILY_MEMBER_VALUE.PRESENT:
            const ageOfUser = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE];
            const sexOfUser = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX];

            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MEMBERSHIP_STATUS].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO
            ].hidden = true;

            // for else condition
            if (ageOfUser < 15 || ageOfUser > 69) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;
            } else {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = false;
            }
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = false;

            if (ageOfUser < 5) metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
            else metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = false;

            if (ageOfUser == 1 && sexOfUser == TYPE_OF_ACTION.MALE) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
              for (let i in metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields) {
                if (i == MOTHER_CHILD_CUSTOM_HIDE[4])
                  metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = false;
                else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = true;
              }
            }
            editRowCallback(
              metadata,
              previousData,
              data,
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB,
              data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOB],
              sectionKey
            );
            editRowCallback(
              metadata,
              previousData,
              data,
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX,
              data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX],
              sectionKey
            );

            if (ageOfUser < 18) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;
            } else {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = false;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = false;
            }

            // defualt disable
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION_NCD].hidden = true;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = false;

            // check other condition
            let ncdValue = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL];
            if (ncdValue)
              editRowCallback(
                metadata,
                previousData,
                data,
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL,
                ncdValue,
                sectionKey
              );

            // mortality info
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = true;

            break;

          case FAMILY_MEMBER_VALUE.DEMISE:
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;

            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;

            // for all NCD || modules
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].hidden = true;

            // metadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO].hidden = true
            // metadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL].hidden = true
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MEMBERSHIP_STATUS].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO
            ].hidden = true;

            //for else condition
            // MORTALITY_INFORMATION.forEach(hhm2 => metadata[hhm2].hidden = false)
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = false;
             metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = false;

            break;

          case FAMILY_MEMBER_VALUE.TRANSFERRED:
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MEMBERSHIP_STATUS].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO
            ].hidden = false;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION_NCD].hidden = true;

            break;

          default:
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_MEASUREMENT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.BLOOD_PRESSURE].hidden = true;

            // for else
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL
            ].hidden = false;

            // from demise
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHASE_2].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].hidden = true;
          
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION_NCD].hidden = true;

            // check other condition
            let ncdValueNew = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL];
            if (ncdValueNew)
              editRowCallback(
                metadata,
                previousData,
                data,
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL,
                ncdValueNew,
                sectionKey
              );
            break;
        }
        break;
      // handle form validation on besis of membership gender
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX:
        const userAge = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE];

        switch (value) {
          case TYPE_OF_ACTION.MALE:
            // true for MALE
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER
            ].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER
            ].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
            ].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
            ].hidden = true;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
            ].hidden = true;

            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;

            if (userAge == 1) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
              for (let i in metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields) {
                if (i == MOTHER_CHILD_CUSTOM_HIDE[4])
                  metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = false;
                else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = true;
              }
            } else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;

            break;

          case TYPE_OF_ACTION.FEMALE:
            // false for FEMALE
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER
            ].hidden = false;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER
            ].hidden = false;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
            ].hidden = false;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
            ].hidden = false;
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
            ].hidden = false;

            if (userAge > 9 && userAge < 50) {
              // metadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY].hidden = false;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
              ].hidden = false;
            } else {
              // metadata[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY].hidden = true;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
              ].hidden = true;
            }

            if (userAge < 40 || userAge > 65) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER
              ].hidden = true;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
              ].hidden = true;
            } else {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER
              ].hidden = false;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
              ].hidden = false;
            }

            if (userAge < 30 || userAge > 65) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER
              ].hidden = true;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
              ].hidden = true;
            } else {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER
              ].hidden = false;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
              ].hidden = false;
            }

            if (userAge < 18 || userAge > 75) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
              ].hidden = true;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
              ].hidden = true;
            } else {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING
              ].hidden = false;
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
                FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
              ].hidden = false;
            }

            // if ((userAge > 14) && (userAge < 50)) metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
            if (userAge > 14 && userAge < 50) {
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;
              for (let i in metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields) {
                if (i == MOTHER_CHILD_CUSTOM_HIDE[4])
                  metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = true;
                else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = false;
              }
            }

            if (userAge == 1) {
              for (let i in metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields) {
                if (i == MOTHER_CHILD_CUSTOM_HIDE[4])
                  metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = false;
                else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[i].hidden = true;
              }
            }
            //  else metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;

            if (userAge < 1) metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;
            if (userAge > 1 && userAge < 14)
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;
            if (userAge > 50) metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = true;

            break;
        }

        if (!caseStop) {
          editRowCallback(
            metadata,
            previousData,
            data,
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO,
            data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.TRANSFER_TO],
            sectionKey
          );
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_DIDSHE_PREGNENT:
        if (value == TYPE_OF_ACTION.NO) {
          // MOTHER_CHILD_SECTION.forEach(hhm2 => metadata[hhm2].hidden = true)
          MOTHER_CHILD_CUSTOM_HIDE.forEach((item) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[item].hidden = true;
          });
          HAS_INITIAN_NOVALUE.forEach((item) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[item].hidden = true;
          });
        } else {
          // MOTHER_CHILD_SECTION.forEach(hhm2 => metadata[hhm2].hidden = false)
          // metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].hidden = false;;
          MOTHER_CHILD_CUSTOM_HIDE.forEach((item) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[item].hidden = false;
          });
          HAS_INITIAN_NOVALUE.forEach((item) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[item].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.CURRENT_MARITAL_STATUS:
        if (value == TYPE_OF_ACTION.NEVER_MARRIED) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.FIRST_MARRIGE_AGE
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTEDFOR_CERVICAL_CANCER:
        if (value == TYPE_OF_ACTION.NO) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
          ].hidden = true;
        } else {
          // data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR] = value;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_CERVICAL_CANCER_LASTYEAR
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_TESTED_BREAST_CANCER:
        if (value == TYPE_OF_ACTION.NO) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LATEST_BREAST_CANCER_LASTYEAR
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PYLORI_SCREENING:
        if (value == TYPE_OF_ACTION.NO) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = true;
        } else {
          // data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST] = value;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DEMOGRAPHIC].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_RECENT_PYLORI_TEST
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_GLASSES_OR_CONTANT_LENCES:
        if (value == TYPE_OF_ACTION.YES) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES
          ].hidden = false;
        }
        if (value == TYPE_OF_ACTION.NO) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_SEEING_GLASSES
          ].hidden = true;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_HEARING_AID:
        if (value == TYPE_OF_ACTION.YES) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING_WITH_AID
          ].hidden = false;
        }
        if (value == TYPE_OF_ACTION.NO) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_DIFFICUULTY_HEARING_WITH_AID
          ].hidden = true;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MANNER_OF_DEATH:
        if (value != TYPE_OF_ACTION.ACCIDENTAL) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL
          ].hidden = true;
        } else {
          // data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL] = value;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_ACCIDENTAL
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_PREGNANT:
        if (value == TYPE_OF_ACTION.YES) {
          HHM2_PRENGENT.forEach((hhm2) => {
            if (metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].fields[hhm2])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].fields[hhm2].hidden = true;
          });
          HHM2_PRENGENT.forEach((hhm2) => {
            if (metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].fields[hhm2])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_PRENGENT.forEach((hhm2) => {
            if (metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].fields[hhm2])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].fields[hhm2].hidden = false;
          });
          HHM2_PRENGENT.forEach((hhm2) => {
            if (metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].fields[hhm2])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_DIABETES_DIAGNOSEDBY_DOCTOR:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_DIABETESDOCTOR_SECTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_DIABETESDOCTOR_SECTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_BLOODSUGER_MEASURED:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_BLOODSUGER_MEASERD_SECTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_BLOODSUGER_MEASERD_SECTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_HYPERTENSION_DIAGNOSIS_BY_DOCTOR.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_BLOOD_PRESSURE_MEASUREDBY_DOCTOR:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_BLOODSUGER_MEASERDBY_DOCTOR.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_BLOODSUGER_MEASERDBY_DOCTOR.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_SPORTS_MODERATE_INTENSITY:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_SPORTS_MODERATE_INTENSITY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_SPORTS_MODERATE_INTENSITY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_INTENSE_SPORTS:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_INTENSE_SPORTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_INTENSE_SPORTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_MINS_CYCLING:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_MINS_CYCLING.forEach((hhm2) => {
            if (metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_MINS_CYCLING.forEach((hhm2) => {
            if (metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2])
              metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_MODERATE_EXERTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_MODERATE_EXERTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_MODERATE_EXERTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_WORK_RELATED_PHYSICAL_EXERTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_WORK_RELATED_PHYSICAL_EXERTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_WORK_RELATED_PHYSICAL_EXERTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_WEEKLY_VEGETABLE_CONSUMTION:
        if (value == 0) {
          HHM2_WEEKLY_VEGETABLE_CONSUMTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_WEEKLY_VEGETABLE_CONSUMTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_WEEKLY_FRUIT_CONSUMTION:
        if (value == 0) {
          HHM2_WEEKLY_FRUIT_CONSUMTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_WEEKLY_FRUIT_CONSUMTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ALCOHOL_CONSUMTION_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_ALCOHOL_CONSUMTION_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_ALCOHOL_CONSUMTION_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ALCOHAL_CONSUMPTION12_MONTH:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_ALCOHAL_CONSUMPTION12_MONTH.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_ALCOHAL_CONSUMPTION12_MONTH.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ALCOHOL_CONSUMPTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_ALCOHOL_CONSUMPTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_ALCOHOL_CONSUMPTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ARECANUT_CONSUMPTION_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_ARECANUT_CONSUMPTION_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_ARECANUT_CONSUMPTION_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_ARECANUT_CONSUMPTION:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_ARECANUT_CONSUMPTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_ARECANUT_CONSUMPTION.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_TABACCO_PRODUCTS_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_TABACCO_PRODUCTS_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_TABACCO_PRODUCTS_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_TOBACCO_PRODUCTS:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_TOBACCO_PRODUCTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_TOBACCO_PRODUCTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_SMOKING_FREQUENCY:
        if (value == TYPE_OF_ACTION.NEVER) {
          HHM2_SMOKING_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_SMOKING_FREQUENCY.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_SMOKED_TOBACCO_PRODUCTS:
        if (value == TYPE_OF_ACTION.NO) {
          HHM2_SMOKED_TOBACCO_PRODUCTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = true;
          });
        } else {
          HHM2_SMOKED_TOBACCO_PRODUCTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].fields[hhm2].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOSE_NAME_HAVE:
        if (value == TYPE_OF_ACTION.NO_DIFICULTY) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOSE_NAME_USE_EQUPMENT
          ].hidden = true;
        } else {
          HHM2_SMOKED_TOBACCO_PRODUCTS.forEach((hhm2) => {
            metadata[MEMBER_FORM_VALIDATIONS_SECTION.WG_SORT].fields[
              FAMILY_MEMBER_METADATA_CUSTOMUPDATE.DOSE_NAME_USE_EQUPMENT
            ].hidden = false;
          });
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_MISCARRIAGE_OR_ABORTION_LASTYEAR:
        if (value)
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_INCIDENCE
          ].hidden = false;
        else
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MOTHER_CHILD_SECTION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_INCIDENCE
          ].hidden = true;
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM2_2_DATE_OF_DEATH:
        const deadAge = calculateAge(value);
        const mermberAge = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.AGE];
        const userSex = data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.SEX];

        if (userSex == TYPE_OF_ACTION.FEMALE && deadAge)
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
          ].hidden = true;
        else
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_42_DAYS_OF_PREGNANCY
          ].hidden = false;

        if (mermberAge > deadAge) data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM2_2_AGE_OF_DEATH] = mermberAge - deadAge;
        else delete data[FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM2_2_AGE_OF_DEATH];

        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_STILL_BIRTH_LASTYEAR:
      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_LIVE_BIRTH_LASTYEAR:
        if (value)
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_DELIVERY
          ]?.hidden = false;
        else
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.MORTALITY_INFORMATION].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_1_PLACE_OF_DELIVERY
          ]?.hidden = true;
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_NCDMODULE_INDIVIDUAL:
        if (value == TYPE_OF_ACTION.NO || value == null || value == undefined) {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION_NCD].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TRANSFER_DETAILS].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.TOBBACO_USE].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.ARECA_NUT].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.ACLOHAL_CONSUMPTION].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.DIET].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_WORK].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_TRAVEL].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.PHYSICAL_ACTIVITY_RECREATIONAL].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_RISED_BP].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.H_OF_DB].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_C_DISEASE].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HEIGHT_WEIGHT].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.WAISE_HIP_CIRCUMFERENCE].hidden = false;

metadata[MEMBER_FORM_VALIDATIONS_SECTION.VERIFICATION_NCD].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_MEASURED_BY_DOCTOR:
        if (value == "false") {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING_LAST_YEAR
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_MEDICATION_BY_DOCTOR
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_LOCAL_HEALER_CONSULTED_FOR_CHOLESTEROL
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_LOCAL_TREATMENT
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING_LAST_YEAR
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_MEDICATION_BY_DOCTOR
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_LOCAL_HEALER_CONSULTED_FOR_CHOLESTEROL
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_LOCAL_TREATMENT
          ].hidden = false;
        }
        break;

      case FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING:
        if (value == "false") {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING_LAST_YEAR
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_MEDICATION_BY_DOCTOR
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_LOCAL_HEALER_CONSULTED_FOR_CHOLESTEROL
          ].hidden = true;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_LOCAL_TREATMENT
          ].hidden = true;
        } else {
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_RAISED_CHOLESTEROL_WARNING_LAST_YEAR
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_MEDICATION_BY_DOCTOR
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_LOCAL_HEALER_CONSULTED_FOR_CHOLESTEROL
          ].hidden = false;
          metadata[MEMBER_FORM_VALIDATIONS_SECTION.HISTORY_OF_CHOLESTEROL].fields[
            FAMILY_MEMBER_METADATA_CUSTOMUPDATE.HHM_2_CHOLESTEROL_LOCAL_TREATMENT
          ].hidden = false;
        }
        break;

      default:
        console.log("default found");
        break;
    }

    // clear disabled elements value
    for (let sectyionKey in metadata) {
      if (metadata[sectyionKey].hidden) {
        for (let filed in metadata[sectyionKey]) {
          for (let ids in metadata[sectyionKey][filed]) {
            delete data[ids];
          }
        }
      } else {
        for (let filed in metadata[sectyionKey]) {
          if (metadata[sectyionKey][filed].hidden) {
            for (let ids in metadata[sectyionKey][filed]) {
              delete data[ids];
            }
          }
        }
      }
    }
    dispatch(changeMember({ ...data, isUpdate: true })); //!important

    // UPDATE DATA
    if (code == "DOB") {
      data["birthyear"] = null;
      data["age"] = null;
    }
    if (code == "birthyear") {
      data["DOB"] = null;
      data["age"] = null;
    }
    if (code == "age") {
      data["birthyear"] = null;
      data["DOB"] = null;
    }

    // Automatically select Femail if it's Wife
    if (code == "relation") {
      if (data["relation"] == "wife") {
        data["sex"] = "F";
      } else {
        if (previousData["relation"] == "wife") {
          data["sex"] = "";
        }
      }
    }

    // For Initial
    if (data["sex"] === "M") {
      metadata["firstname"].prefix = t("Mr");
    } else if (data["sex"] === "F") {
      metadata["firstname"].prefix = t("Mrs");
    }

    dispatch(houseHoldMemberFormMetaData(metadata));
  };

  const callbackFunction = (metadata, dataRows, rowIndex = null, actionType) => {
    // clean selected member
    if (actionType === "clean") {
      dispatch(changeMember({}));
      return;
    }

    // set selected member is about to be deleted
    if (actionType === "delete_member_selected") {
      const memberData = JSON.parse(JSON.stringify(dataRows)); // only for delete case
      console.log({ memberData });
      dispatch(changeMember({ ...memberData, isDelete: true })); // only for data
      console.log("callbackFunction rowIndex delete", rowIndex, actionType);
      return;
    }

    // on deleted member
    if (actionType === "delete_member") {
      console.log("delete_member");
      return;
    }

    // disable complete button
    // setDisableCompleteBtn(dataRows["rows"].length <= 0);

    // FOR PARTICULAR ROW
    if (rowIndex != null) {
      console.log("callbackFunction rowIndex", dataRows["rows"][rowIndex].id);

      // Set default value for Active memberz
      if (!Boolean(dataRows["rows"][rowIndex]["status"])) {
        dataRows["rows"][rowIndex]["status"] = "active";
      }
    }
    // FOR ALL ROWS
    // Calculate Age Group
    let tempValues = calculateAgeGroup(dataRows["rows"], currentEvent);
    console.log("calculateAgeGroup", dataRows["rows"], tempValues);
    Object.entries(tempValues).forEach((v) => {
      if (v[1] === 0) {
        v[1] = "";
      }
      changeEventDataValue(v[0], v[1]);
    });
    dataRows["rows"] = _.sortBy(dataRows["rows"], function (item) {
      return item["relation"] === "head" ? 0 : 1;
    });
  };

  const initFunction = (metadata, dataRows, rowIndex = null) => {
    // if (metadata) {
    //   if (events && events.length > 1) {
    //     metadata["Status"].hidden = false;
    //   }
    // }
  };

  if (!events && events.length <= 0) {
    return <Paper className={classes.paper}>Add Event</Paper>;
  }

  return (
    events &&
    events.length > 0 && (
      <div className={familyMemberFormContainer}>
        {blockEntry && <div className={"modalBackdrop"}></div>}
        <Paper className={classes.paper}>
          <LoadingCascadeTable
            loading={loading}
            mask
            loaded={true}
            locale={i18n.language || "en"}
            metadata={metadata}
            data={data}
            currentEvent={currentEvent}
            changeEventDataValue={changeEventDataValue}
            initFunction={initFunction}
            editRowCallback={editRowCallback}
            callbackFunction={callbackFunction}
            originMetadata={originMetadata}
            setMetadata={setMetadata}
            setData={setData}
            t={t}
            externalComponents={externalComponents}
            maxDate={`${year}-12-31`}
            minDate={props.minDate}
            handleSaveButton={handleSaveButton}
          />
        </Paper>
      </div>
    )
  );
};

export default FamilyMemberForm;
