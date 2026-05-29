import React, { useState, useEffect } from "react";
import { CustomDataProvider } from "@dhis2/app-runtime";
import { OrganisationUnitTree } from "@dhis2/ui";
import { useSelector } from "react-redux";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";
import useApi from "../../hooks/useApi.js";
import * as organisationUnitManager from "@/indexDB/OrganisationUnitManager/OrganisationUnitManager";

const OrgUnitSelector = ({ singleSelection, limit, selectedOrgUnit, handleSelectOrgUnit, filter }) => {
  const { metadataApi } = useApi();
  const { offlineStatus } = useSelector((state) => state.common);
  const { orgUnits } = useSelector((state) => state.metadata);
  const [orgUnitData, setOrgUnitData] = useState(null);

  useEffect(() => {
    if (orgUnits) {
      if (offlineStatus) {
        organisationUnitManager.getOrgUnitSelectorData({ orgUnits, filter }).then((json) => {
          setOrgUnitData(json);
        });
      } else {
        metadataApi.getOrgUnitSelectorData({ orgUnits, filter }).then((json) => {
          setOrgUnitData(json);
        });
      }
    }
  }, [orgUnits]);

  const selectedOrgUnitId = typeof selectedOrgUnit === "string"
    ? selectedOrgUnit
    : (selectedOrgUnit?.id || (selectedOrgUnit?.selected?.[0]?.split("/").pop()) || "");

  const findOrgUnit = (orgUnitsList, id) => {
    if (!orgUnitsList || !id) return null;
    const found = orgUnitsList.find((ou) => ou.id === id);
    if (found) return found;
    for (const ou of orgUnitsList) {
      if (ou.children) {
        const childFound = ou.children.find((c) => c.id === id);
        if (childFound) return childFound;
      }
    }
    return null;
  };

  const foundSelectedOrgUnit = findOrgUnit(orgUnits, selectedOrgUnitId);
  let transformedSelectedOrgUnit = null;
  if (foundSelectedOrgUnit && orgUnitData) {
    if (orgUnitData.roots.includes(selectedOrgUnitId)) {
      transformedSelectedOrgUnit = ["/" + foundSelectedOrgUnit.id];
    } else {
      transformedSelectedOrgUnit = [foundSelectedOrgUnit.path];
    }
  }

  let selectedPaths = [];
  if (selectedOrgUnit) {
    if (typeof selectedOrgUnit === "string") {
      if (transformedSelectedOrgUnit) {
        selectedPaths = transformedSelectedOrgUnit;
      }
    } else if (Array.isArray(selectedOrgUnit.selected)) {
      if (selectedOrgUnit.selected.every(p => p.startsWith("/"))) {
        selectedPaths = selectedOrgUnit.selected;
      } else {
        selectedPaths = selectedOrgUnit.selected.map(id => {
          if (id.startsWith("/")) return id;
          const ou = findOrgUnit(orgUnits, id);
          if (ou && orgUnitData) {
            return orgUnitData.roots.includes(id) ? "/" + ou.id : ou.path;
          }
          return id;
        }).filter(Boolean);
      }
    } else if (transformedSelectedOrgUnit) {
      selectedPaths = transformedSelectedOrgUnit;
    }
  }

  return orgUnitData ? (
    <CustomDataProvider data={orgUnitData.tree}>
      <OrganisationUnitTree
        initiallyExpanded={transformedSelectedOrgUnit ? transformedSelectedOrgUnit : orgUnitData.roots}
        roots={orgUnitData.roots}
        singleSelection={singleSelection}
        selected={selectedPaths}
        onChange={(selected) => {
          //singleSelection mode or multiple but not limit
          if (singleSelection || !limit) handleSelectOrgUnit(selected);
          //multiple mode with limit
          if (selected.selected.length <= limit) handleSelectOrgUnit(selected);
        }}
      />
    </CustomDataProvider>
  ) : (
    <LoadingMask />
  );
};

export default OrgUnitSelector;
