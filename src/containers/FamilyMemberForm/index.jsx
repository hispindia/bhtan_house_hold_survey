import { useEffect } from "react";
/* REDUX */
import { submitEventDataValues } from "../../redux/actions/data/tei/currentEvent";
/* REDUX */
import { useDispatch, useSelector } from "react-redux";

/* Components */
import { getEventByYearAndHalt6Month } from "@/utils/event";
import FamilyMemberForm from "../../components/FamilyMemberForm/FamilyMemberForm.jsx";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import { useEvent } from "../../hooks";
import FIForm from "../../skeletons/TeiList";

const LoadingFamilyMemberForm = withSkeletonLoading(FIForm)(FamilyMemberForm);

const FamilyMemberFormContainer = () => {
  const { minDate, maxDate } = useSelector((state) => state.metadata);
  const events = useSelector((state) => state.data.tei.data.currentEvents);
  const tei = useSelector((state) => state.data.tei);
  const selectedYear = useSelector((state) => state.data.tei.selectedYear);

  const eventData = getEventByYearAndHalt6Month(events, selectedYear.year, selectedYear.selected6Month);

  const { event, initEvent, changeEvent, changeEventDataValue, setEventDirty } = useEvent(
    eventData ? JSON.parse(JSON.stringify(eventData)) : []
  );
  const queryParams = new URLSearchParams(window.location.hash.split('?')[1]);

  const uniqueTeiId = queryParams.get('tei');
  const dispatch = useDispatch();

  useEffect(() => {
    if (events && events.length > 0 && eventData) {
      initEvent(JSON.parse(JSON.stringify(eventData)));
    }
  }, [selectedYear, JSON.stringify(events)]);
  console.log('tei in handleSave button', tei)
  const handleSaveButton = (reload = false) => {
    if (event._isDirty) {
      console.log('handleSave button event==', event)
      const updatedDataValues = {
        ...event.dataValues,
        // AR4iOcpv7ly: uniqueTeiId,
      };
      // dispatch(submitEventDataValues(event.dataValues, reload));
      dispatch(submitEventDataValues(updatedDataValues, reload));
      setEventDirty(false);
    }
  };

  const handleChangeDataValue = (dataElement, value) => {
    changeEventDataValue(dataElement, value);
    setEventDirty(true);
  };

  return (
    <LoadingFamilyMemberForm
      loading={tei.loading}
      loaded={true}
      mask
      currentEvent={event}
      changeEventDataValue={handleChangeDataValue}
      changeEvent={changeEvent}
      blockEntry={false}
      events={events}
      externalComponents={<div></div>}
      setDisableCompleteBtn={() => { }}
      maxDate={maxDate}
      minDate={minDate}
      handleSaveButton={handleSaveButton}
    />
  );
};

export default withOrgUnitRequired()(FamilyMemberFormContainer);
