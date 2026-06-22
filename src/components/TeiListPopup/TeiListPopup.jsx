import React, { useState, useEffect } from "react";
import { Modal, Table, Spin, Button, Empty } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { TableColumn } from "../../utils";
import { dataApi } from "../../api";
import { mutateAttributes } from "@/redux/actions/data/tei/currentTei";
import { updateCascade } from "@/redux/actions/data/tei/currentCascade";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import { submitEventDataValues } from "@/redux/actions/data/tei/currentEvent";

const TeiListPopup = ({ visible, orgUnitId, onClose, }) => {
  const { t } = useTranslation();
  const [teisData, setTeisData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedTei, setSelectedTei] = useState(null);
  const programMetadata = useSelector((state) => state.metadata?.programMetadata);
  const trackedEntityAttributes = programMetadata?.trackedEntityAttributes || [];
  const programId = programMetadata?.id;
  const orgUnits = useSelector((state) => state.metadata?.orgUnits || []);
  const selectedOrgunitTei = useSelector((state) => state.metadata?.selectedOrgUnit?.id);
  const selectedMember = useSelector(
    (state) => state.data?.tei?.selectedMember

  );
  const currentTei = useSelector((state) => state.data?.tei?.data?.currentTei);
  const currentCascade = useSelector((state) => state.data?.tei?.data?.currentCascade);
  const { year } = useSelector((state) => state.data?.tei?.selectedYear || {});
  const offlineStatus = useSelector((state) => state.common?.offlineStatus);
  const dispatch = useDispatch();
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

  const selectedOrgUnit = findOrgUnit(orgUnits, orgUnitId);
  const orgUnitLabel = selectedOrgUnit ? selectedOrgUnit.displayName : orgUnitId;
  const fetchTeis = async (currentPage, currentPageSize) => {
    if (!orgUnitId || !programId) return;
    setLoading(true);
    try {
      let response;
      if (offlineStatus) {
        response = await trackedEntityManager.find({
          orgUnit: orgUnitId,
          program: programId,
          paging: false,
          ouMode: "SELECTED"
        });
      } else {
        response = await dataApi.getTrackedEntityInstanceListByQuery(
          orgUnitId,
          programId,
          1000,
          1,
          // currentPageSize,
          // currentPage,
          "",
          "created:desc"
        );
      }
      setTeisData(response);
      if (response && response.total !== undefined && response.total !== "undefined") {
        setTotal(response.total);
      } else if (response && response.instances) {
        setTotal(response.instances.length);
      }
    } catch (err) {
      console.error("Error fetching TEIs for popup:", err);
    } finally {
      setLoading(false);
    }
  };
  const transferTei = async (tei, ou, program) => {
    try {
      const response = await dataApi.getTransfer(ou, program, tei);
      // Optional: refresh list after transfer
      fetchTeis();
    } catch (err) {
      console.error("Error transferring TEI:", err);
    }
  };

  useEffect(() => {
    if (visible && orgUnitId && programId) {
      fetchTeis(page, pageSize);
    }
  }, [visible, orgUnitId, programId, page, pageSize]);

  // Reset page and selection when visible or orgUnitId changes
  useEffect(() => {
    if (visible) {
      setPage(1);
      setSelectedTei(null);
    }
  }, [visible, orgUnitId]);

  const createColumns = () => {
    let columns = trackedEntityAttributes
      .filter((tea) => tea.displayInList)
      .map((tei) => {
        return {
          title: tei.displayFormName,
          dataIndex: tei.id,
          key: tei.id,
          render: (value) => <TableColumn metadata={tei} value={value} />,
        };
      });

    const lastUpdatedObject = {
      title: t("lastUpdated") || "Last Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value) => {
        return (
          <TableColumn
            metadata={null}
            external={{ name: "updatedAt", type: "DATE" }}
            value={value}
          />
        );
      },
    };
    columns.unshift(lastUpdatedObject);
    return columns;
  };

  const createDataSource = () => {
    if (!teisData || !teisData.instances) return [];
    const columns = createColumns();

    return teisData.instances.map((tei, index) => {
      const rowObject = {
        key: index,
        teiId: tei.trackedEntity,
        updatedAt: tei.updatedAt,
      };

      columns.forEach((column) => {
        if (column.dataIndex === "updatedAt") return;
        const attribute = tei.attributes?.find((attr) => attr.attribute === column.dataIndex);
        rowObject[column.dataIndex] = attribute ? attribute.value : "";
      });

      return rowObject;
    });
  };

  const columns = createColumns();
  const dataSource = createDataSource();

  return (
    <Modal
      title={
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingRight: "24px" }}>
          <div>
            <span style={{ fontSize: "18px", fontWeight: "600", color: "#1890ff" }}>
              {t("List of Households") || "Tracked Entity Instances"}
            </span>
            <span style={{ fontSize: "14px", fontWeight: "normal", color: "#8c8c8c", marginLeft: "12px" }}>
              ({orgUnitLabel})
            </span>
          </div>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={() => fetchTeis(page, pageSize)}
            loading={loading}
            size="small"
          >
            {t("reload") || "Reload"}
          </Button>
        </div>
      }
      open={visible}
      onCancel={onClose}
      zIndex={3000}
      footer={[
        <Button key="close" onClick={onClose}>
          {t("close") || "Close"}
        </Button>,
        <Button
          key="submit"
          type="primary"
          disabled={!selectedTei}
          onClick={async () => {
            const selectedAttribute = selectedTei?.attributes?.find(
              (attr) => attr.attribute === "b4UUhQPwlRH"
            );

            const targetTeiId =
              selectedTei?.trackedEntity ||
              selectedTei?.teiId ||
              selectedTei?.trackedEntityInstance;
            try {
              if (offlineStatus) {
                if (selectedOrgunitTei === selectedOrgUnit?.id) {
                  console.log("Offline Condition TRUE");

                  if (selectedAttribute && targetTeiId) {
                    const existingTei = await trackedEntityManager.getTrackedEntityInstanceById({
                      trackedEntity: selectedMember?.id,
                      program: programId,
                    });

                    let updatedAttributes = existingTei?.attributes ? [...existingTei.attributes] : [];
                    const updateAttribute = (attrId, attrVal) => {
                      const idx = updatedAttributes.findIndex((attr) => attr.attribute === attrId);
                      if (idx > -1) {
                        updatedAttributes[idx] = { ...updatedAttributes[idx], value: attrVal };
                      } else {
                        updatedAttributes.push({ attribute: attrId, value: attrVal });
                      }
                    };

                    updateAttribute("hDE1WNqTTwF", selectedAttribute.value);
                    updateAttribute("gv9xX5w4kKt", targetTeiId);
                    const teiPayload = {
                      ...existingTei,
                      trackedEntity: selectedMember?.id,
                      orgUnit: selectedOrgunitTei,
                      trackedEntityType: "Y2TBztNgJpH",
                      attributes: updatedAttributes,
                      enrollments: existingTei?.enrollments || [],
                    };

                    await trackedEntityManager.setTrackedEntityInstance({
                      trackedEntity: teiPayload,
                    });

                    console.log("Offline Update Success");
                  }
                } else {
                  console.log("Offline Condition FALSE - Alerting");
                  alert(t("cannotTransferOffline") || "Cannot transfer TEI while offline.");
                  return;
                }
              }
               else {
                if (selectedOrgunitTei === selectedOrgUnit?.id) {
                  console.log("Condition TRUE");

                  if (selectedAttribute && targetTeiId) {
                    const teiPayload = {
                      trackedEntity: selectedMember?.id,
                      orgUnit: selectedOrgunitTei,
                      trackedEntityType: "Y2TBztNgJpH",
                      attributes: [
                        {
                          attribute: "hDE1WNqTTwF",
                          value: selectedAttribute.value,
                        },
                        {
                          attribute: "gv9xX5w4kKt",
                          value: targetTeiId,
                        },
                      ],
                    };

                    await dataApi.postTrackedEntityInstances({
                      trackedEntities: [teiPayload],
                    });

                    console.log("API Update Success");
                  }

                  const selectedTeiId =
                    selectedTei?.trackedEntity || selectedTei?.teiId;

                  // if (selectedTeiId) {
                  //   const updatedDataValues = {
                  //     ig2YSpQdP55: selectedTeiId,
                  //   };
                  //
                  //   dispatch(submitEventDataValues(updatedDataValues, false));
                  // }
                } 
                else {
                  console.log("Condition FALSE");
                  const programIID = "xvzrp56zKvI";
                  if (selectedMember?.id && selectedOrgUnit?.id && programIID) {
                    await transferTei(
                      selectedMember?.id,
                      selectedOrgUnit.id,
                      programIID
                    );

                    console.log("TEI Transfer Success");
                  }

                  if (selectedAttribute && targetTeiId) {
                    const teiPayload = {
                      trackedEntity: selectedMember?.id,
                      orgUnit: selectedOrgUnit?.id, // target org unit after transfer
                      trackedEntityType: "Y2TBztNgJpH",
                      attributes: [
                        {
                          attribute: "hDE1WNqTTwF",
                          value: selectedAttribute.value,
                        },
                        {
                          attribute: "gv9xX5w4kKt",
                          value: targetTeiId,
                        },
                      ],
                    };

                    await dataApi.postTrackedEntityInstances({
                      trackedEntities: [teiPayload],
                    });

                    console.log("Attribute Update Success After Transfer");
                  }
                }
              }
            } catch (error) {
              console.error("Submit operation failed:", error);
            }

            onClose(true);
            window.location.reload();
          }}
        >
          {t("submit") || "Submit"}
        </Button>
        
      ]}
      width={1300}
      bodyStyle={{ padding: "12px 24px", minHeight: "350px" }}
      style={{ top: 40 }}
      maskClosable={true}
    >
      <style>{`
        .selected-row-highlight {
          background-color: #05a0e8 !important;
        }
        .ant-table-row {
          cursor: pointer;
        }
      `}</style>
      <Spin spinning={loading} tip={t("loading") || "Loading..."}>
        <div style={{ marginTop: "12px" }}>
          <Table
            columns={columns}
            dataSource={dataSource}
            bordered
            scroll={{ x: 800, y: 400 }}
            pagination={false}
            rowClassName={(record) => {
              const isSelected = selectedTei && (selectedTei.trackedEntity === record.teiId || selectedTei.teiId === record.teiId);
              return isSelected ? "selected-row-highlight" : "";
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  const originalTei = teisData?.instances?.find(inst => inst.trackedEntity === record.teiId);
                  setSelectedTei(originalTei || record);
                }
              };
            }}
            locale={{
              emptyText: <Empty description={t("noData") || "No TEIs registered in this Organisation Unit"} />,
            }}
          // pagination={{
          //   position: ["bottomCenter"],
          //   showSizeChanger: true,
          //   current: page,
          //   pageSize: pageSize,
          //   total: total,
          //   onChange: (newPage, newPageSize) => {
          //     setPage(newPage);
          //     setPageSize(newPageSize);
          //   },
          // }}
          />
        </div>
      </Spin>
    </Modal>
  );
};

export default TeiListPopup;
