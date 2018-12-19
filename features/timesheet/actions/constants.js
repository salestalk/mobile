const asyncActionType = type => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
  RESET: `${type}_RESET`,
  CLEAR: `${type}_CLEAR`
});

export const TIMESHEET_LIST = asyncActionType('TIMESHEET_LIST');
export const TIMESHEET_DETAIL = asyncActionType('TIMESHEET_DETAIL');
export const TIMESHEET_INSERT = asyncActionType('TIMESHEET_INSERT');
export const TIMESHEET_UPDATE = asyncActionType('TIMESHEET_UPDATE');
