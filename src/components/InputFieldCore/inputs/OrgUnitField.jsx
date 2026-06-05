import React, { useState, useEffect } from "react";
import { Input, Popover, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import OrgUnitSelector from "../../OrgUnitSelector/OrgUnitSelector.component";
import TeiListPopup from "../../TeiListPopup/TeiListPopup";

const OrgUnitField = ({
  value,
  onChange,
  onBlur = null,
  disabled,
  filter,
  onCloseModal,
  ...props
}) => {
  const { t } = useTranslation();
  const orgUnits = useSelector((state) => state.metadata?.orgUnits || []);

  const [popoverOpen, setPopoverOpen] = useState(false);
  const [tempSelectedId, setTempSelectedId] = useState(value);
  const [teiPopupOpen, setTeiPopupOpen] = useState(false);

  useEffect(() => {
    setTempSelectedId(value);
  }, [value]);

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

  const selectedOrgUnit = findOrgUnit(orgUnits, value);
  const orgUnitLabel = selectedOrgUnit ? selectedOrgUnit.displayName : "";

  return (
    <div style={{ width: "100%" }}>
      <Popover
        placement="bottomLeft"
        open={popoverOpen}
        onOpenChange={(visible) => {
          if (disabled) return;
          setPopoverOpen(visible);
          if (visible) {
            setTempSelectedId(value);
          }
        }}
        trigger="click"
        zIndex={2000}
        overlayStyle={{ zIndex: 2000 }}
        content={
          <div style={{ padding: "8px", minWidth: "320px" }}>
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                marginBottom: "12px",
                border: "1px solid #f0f0f0",
                borderRadius: "4px",
                padding: "8px",
              }}
            >
              <OrgUnitSelector
                singleSelection={true}
                selectedOrgUnit={tempSelectedId}
                filter={filter}
                handleSelectOrgUnit={(selected) => {
                  setTempSelectedId(selected.id);
                }}
                {...props}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Button
                size="small"
                onClick={() => setPopoverOpen(false)}
              >
                {t("cancel") || "Cancel"}
              </Button>
              <Button
                type="primary"
                size="small"
                disabled={!tempSelectedId}
                onClick={() => {
                  onChange(tempSelectedId);
                  if (onBlur) {
                    onBlur(tempSelectedId);
                  }
                  setPopoverOpen(false);
                  setTeiPopupOpen(true);
                }}
              >
                {t("select") || "Select"}
              </Button>
            </div>
          </div>
        }
      >
        <div style={{ width: "100%", cursor: disabled ? "not-allowed" : "pointer" }}>
          <Input
            type="text"
            value={orgUnitLabel}
            placeholder="[Please select]"
            readOnly
            disabled={disabled}
            style={{ pointerEvents: disabled ? "none" : "auto" }}
            suffix={
              <PlusOutlined
                style={{
                  color: disabled ? "rgba(0, 0, 0, 0.25)" : "#1890ff",
                  cursor: disabled ? "not-allowed" : "pointer",
                  fontSize: "16px",
                }}
              />
            }
          />
        </div>
      </Popover>
      <TeiListPopup
        visible={teiPopupOpen}
        orgUnitId={value || tempSelectedId}
        onClose={(submitSuccess = false) => {
          setTeiPopupOpen(false);
          if (submitSuccess) {
            setPopoverOpen(false);
            if (onCloseModal) {
              onCloseModal();
            }
          }
        }}
      />
    </div>
  );
};

export default OrgUnitField;
