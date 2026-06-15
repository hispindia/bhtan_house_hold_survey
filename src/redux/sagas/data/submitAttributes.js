import { call, put, select, takeLatest } from "redux-saga/effects";
import { SUBMIT_ATTRIBUTES } from "../../types/data/tei";
import { generateDhis2Payload } from "../../../utils";
import { dataApi } from "../../../api";
import { mutateAttributes, updateNewStatus } from "../../actions/data/tei/currentTei";
import { getTeiError, getTeiSuccessMessage, loadTei } from "../../actions/data/tei";
import { editingAttributes } from "../../actions/data";
import { getTeiId } from "./utils";
import moment from "moment";
import { push } from "connected-react-router";
import * as trackedEntityManager from "@/indexDB/TrackedEntityManager/TrackedEntityManager";
import * as enrollmentManager from "@/indexDB/EnrollmentManager/EnrollmentManager";
// Original code
// function* handleSubmitAttributes({ attributes }) {
//   yield put(loadTei(true));
//   const teiId = yield call(getTeiId);

//   const { currentTei, currentEnrollment } = yield call(makePayload, attributes);

//   console.log("handleSubmitAttributes", {
//     teiId,
//     attributes,
//     currentTei,
//     currentEnrollment,
//   });

//   try {
//     if (teiId) {
//       yield call(putTeiToServer, {
//         currentTei,
//         currentEnrollment,
//         attributes,
//       });
//       yield put(getTeiSuccessMessage(`Updated tracked entity instance: ${teiId} successfully`));
//     } else {
//       yield call(postTeiToServer, {
//         currentTei,
//         currentEnrollment,
//         attributes,
//       });
//       yield put(getTeiSuccessMessage(`Created new tracked entity instance: ${currentTei.trackedEntity} successfully`));
//     }
//     yield put(mutateAttributes(attributes));
//     yield put(updateNewStatus(false));
//     yield put(editingAttributes(false));
//   } catch (e) {
//     console.error("handleSubmitAttributes", e.message);
//     yield put(getTeiError(e.message));
//   }

//   yield put(loadTei(false));
// }
// push correct value withoud effecting any other 
// below is correct comma to dot
// --- SANITIZE: Fix decimal commas + remove invalid characters ---
const sanitizeCoordinate = (value) => {
  if (!value) return "";

  // Extract numbers from inside brackets
  const match = value.match(/-?\d[^,\]]*/g);
  if (!match || match.length !== 2) return value;

  const fixNumber = (num) => {
    // Turn any non-digit sequence inside the number into a decimal point
    num = num.replace(/[^0-9.\-]+/g, ".");

    // Collapse multiple dots into a single dot
    const parts = num.split(".");
    if (parts.length > 2) {
      num = parts[0] + "." + parts.slice(1).join("");
    }

    return num;
  };

  const lon = fixNumber(match[0]);
  const lat = fixNumber(match[1]);

  return `[${lon}, ${lat}]`;
};


// // // // --- VALIDATE: Strict DHIS2 coordinate format ---
const isValidCoordinate = (value) => {
  if (!value) return false;

  // Reject disallowed characters before regex match
  if (/[^0-9\[\]\s,.\-]/.test(value)) {
    return false;
  }

  const regex = /^\[\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\]$/;
  return regex.test(value);
};


function* handleSubmitAttributes({ attributes }) {
  yield put(loadTei(true));
  const teiId = yield call(getTeiId);

  // -------------------------------
  //      COORDINATE VALIDATION
  // -------------------------------
  if (attributes.SHPW4d00NnM) {
    const raw = attributes.SHPW4d00NnM;

    // 1. sanitize
    const cleaned = sanitizeCoordinate(raw);

    // 2. validate sanitized coordinate
    if (!isValidCoordinate(cleaned)) {
      yield put(
        getTeiError(
          "Invalid coordinate format. Expected format: [longitude, latitude]"
        )
      );
      yield put(loadTei(false));
      return; // stop submission
    }

    // 3. assign sanitized valid value
    attributes.SHPW4d00NnM = cleaned;
  }
  // -------------------------------


  const { currentTei, currentEnrollment } = yield call(makePayload, attributes);

  try {
    if (teiId) {
      yield call(putTeiToServer, {
        currentTei,
        currentEnrollment,
        attributes,
      });
      yield put(
        getTeiSuccessMessage(
          `Updated tracked entity instance: ${teiId} successfully`
        )
      );
    } else {
      yield call(postTeiToServer, {
        currentTei,
        currentEnrollment,
        attributes,
      });
      yield put(
        getTeiSuccessMessage(
          `Created new tracked entity instance: ${currentTei.trackedEntity} successfully`
        )
      );
    }

    yield put(mutateAttributes(attributes));
    yield put(updateNewStatus(false));
    yield put(editingAttributes(false));
  } catch (e) {
    console.error("handleSubmitAttributes", e.message);
    yield put(getTeiError(e.message));
  }

  yield put(loadTei(false));
}

////////////////////////////////////////////111111111111111
// Fix decimal comma → dot (28,6294016 → 28.6294016)
// const sanitizeCoordinate = (value) => {
//   if (!value) return "";
//   return value.replace(/(\d),(\d)/g, "$1.$2");
// };

// Strict DHIS2 coordinate validation
// const isValidCoordinate = (value) => {
//   if (!value) return false;
//   const regex = /^\[\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\]$/;
//   return regex.test(value);
// };

// function* handleSubmitAttributes({ attributes }) {
//   yield put(loadTei(true));
//   const teiId = yield call(getTeiId);

//   // -----------------------
//   // Coordinate Validation
//   // -----------------------
//   if (attributes.SHPW4d00NnM) {

//     // Step 1: Fix decimal comma if user typed 28,629 → 28.629
//     const cleaned = sanitizeCoordinate(attributes.SHPW4d00NnM);

//     // Step 2: Validate DHIS2 format [lon, lat]
//     if (!isValidCoordinate(cleaned)) {

//       // Show an error message to the user
//       yield put(
//         getTeiError(
//           "Invalid coordinate format. Correct example: [75.7872709, 26.9124336]"
//         )
//       );

//       // Stop submission — prevent saving bad coordinates
//       yield put(loadTei(false));
//       return;
//     }

//     // Step 3: Save sanitized, valid coordinate back to attributes
//     attributes.SHPW4d00NnM = cleaned;
//   }
//   // -----------------------

//   const { currentTei, currentEnrollment } = yield call(
//     makePayload,
//     attributes
//   );

//   try {
//     if (teiId) {
//       yield call(putTeiToServer, {
//         currentTei,
//         currentEnrollment,
//         attributes,
//       });
//       yield put(
//         getTeiSuccessMessage(
//           `Updated tracked entity instance: ${teiId} successfully`
//         )
//       );
//     } else {
//       yield call(postTeiToServer, {
//         currentTei,
//         currentEnrollment,
//         attributes,
//       });
//       yield put(
//         getTeiSuccessMessage(
//           `Created new tracked entity instance: ${currentTei.trackedEntity} successfully`
//         )
//       );
//     }

//     yield put(mutateAttributes(attributes));
//     yield put(updateNewStatus(false));
//     yield put(editingAttributes(false));
//   } catch (e) {
//     console.error("handleSubmitAttributes", e.message);
//     yield put(getTeiError(e.message));
//   }

//   yield put(loadTei(false));
// }

/////////////////////2222222222222222
// Check if number contains an internal comma (invalid)

// Reject numbers like 77,277140 → invalid(warninf message)

// const hasInternalComma = (value) => {
//   return /(\d),(\d)/.test(value);
// };

// const isValidCoordinate = (value) => {
//   if (!value) return false;

//   // Must match: [longitude, latitude]
//   const regex = /^\[\s*(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)\s*\]$/;
//   return regex.test(value);
// };

// function* handleSubmitAttributes({ attributes }) {
//   yield put(loadTei(true));
//   const teiId = yield call(getTeiId);

//   // -----------------------
//   // Coordinate Validation
//   // -----------------------
//   if (attributes.SHPW4d00NnM) {
//     const coord = attributes.SHPW4d00NnM;

//     // 1. If comma exists inside a number → ERROR
//     if (hasInternalComma(coord)) {
//       yield put(
//         getTeiError(
//           "Invalid coordinate. Do not use commas inside numbers. Example: [75.7872709, 26.9124336]"
//         )
//       );
//       yield put(loadTei(false));
//       return;
//     }

//     // 2. If basic DHIS2 format fails → ERROR
//     if (!isValidCoordinate(coord)) {
//       yield put(
//         getTeiError(
//           "Invalid coordinate format. Use: [longitude, latitude]"
//         )
//       );
//       yield put(loadTei(false));
//       return;
//     }
//   }
//   // -----------------------

//   const { currentTei, currentEnrollment } = yield call(
//     makePayload,
//     attributes
//   );

//   try {
//     if (teiId) {
//       yield call(putTeiToServer, {
//         currentTei,
//         currentEnrollment,
//         attributes,
//       });
//       yield put(
//         getTeiSuccessMessage(
//           `Updated tracked entity instance: ${teiId} successfully`
//         )
//       );
//     } else {
//       yield call(postTeiToServer, {
//         currentTei,
//         currentEnrollment,
//         attributes,
//       });
//       yield put(
//         getTeiSuccessMessage(
//           `Created new tracked entity instance: ${currentTei.trackedEntity} successfully`
//         )
//       );
//     }

//     yield put(mutateAttributes(attributes));
//     yield put(updateNewStatus(false));
//     yield put(editingAttributes(false));
//   } catch (e) {
//     console.error("handleSubmitAttributes", e.message);
//     yield put(getTeiError(e.message));
//   }

//   yield put(loadTei(false));
// }
/////////////////EEEEEEEEEEEEEEEEE

function* makePayload(attributes) {
  const data = yield select((state) => state.data.tei.data);
  const programMetadata = yield select((state) => state.metadata.programMetadata);

  const newCurrentTei = { ...data.currentTei, attributes };
  const { currentTei, currentEnrollment } = generateDhis2Payload(
    { ...data, currentTei: newCurrentTei },
    programMetadata
  );
  return {
    currentTei,
    currentEnrollment,
  };
}

function* putTeiToServer({ currentTei, currentEnrollment, attributes }) {
  console.log("putTeiToServer");
  const { offlineStatus } = yield select((state) => state.common);
  const programMetadataId = yield select((state) => state.metadata.programMetadata.id);

  if (offlineStatus) {
    debugger
    yield call(trackedEntityManager.setTrackedEntityInstance, {
      trackedEntity: currentTei,
    });
  } else {
    // yield call(dataApi.putTrackedEntityInstance, currentTei, programMetadataId);
    yield call(
      dataApi.postTrackedEntityInstances,
      {
        trackedEntities: [currentTei],
      },
      programMetadataId
    );
  }
}

function* postTeiToServer({ currentTei, currentEnrollment, attributes }) {
  const { offlineStatus } = yield select((state) => state.common);
  const programMetadataId = yield select((state) => state.metadata.programMetadata.id);
  const newEnrollment = {
    ...currentEnrollment,
    enrolledAt: moment().format("YYYY-MM-DD"),
    incidentDate: moment().format("YYYY-MM-DD"),
  };

  console.log("postTeiToServer", {
    currentTei,
    currentEnrollment,
    attributes,
    newEnrollment,
  });

  if (offlineStatus) {
    const teiWithEnrollment = currentTei;
    teiWithEnrollment.enrollments = [newEnrollment];

    console.log(teiWithEnrollment);

    yield call(trackedEntityManager.setTrackedEntityInstance, {
      trackedEntity: teiWithEnrollment,
    });
  } else {
    yield call(
      dataApi.pushTrackedEntityInstance,
      {
        trackedEntities: [currentTei],
      },
      programMetadataId
    );
    yield call(
      dataApi.pushEnrollment,
      {
        enrollments: [newEnrollment],
      },
      programMetadataId
    );
  }

  yield put(push(`/form?tei=${currentTei.trackedEntity}`));
}

export default function* submitAttributes() {
  yield takeLatest(SUBMIT_ATTRIBUTES, handleSubmitAttributes);
}
