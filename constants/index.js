export const BASE_URL = 'https://salestalktech.com/SalesAcceleration/';

const asyncActionType = type => ({
  PENDING: `${type}_PENDING`,
  SUCCESS: `${type}_SUCCESS`,
  ERROR: `${type}_ERROR`,
  RESET: `${type}_RESET`,
  CLEAR: `${type}_CLEAR`
});

export const LOGIN = asyncActionType('LOGIN');
export const LOGOUT = asyncActionType('LOGOUT');
export const AUTHORIZE = 'AUTHORIZE';
