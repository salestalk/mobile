import { AsyncStorage, Alert } from 'react-native';
const URI = `https://salestalktech.com/SalesAcceleration/open/`;
import * as constants from './constants';

const getTimeSheet = ({ userId, tenantId, domainId }, startDate, endDate) => {
  return dispatch => {
    dispatch({
      type: constants.TIMESHEET_LIST.PENDING
    });

    fetch(
      `${URI}open/GetTimeSheetList/UserId=${userId}&StartDate=${startDate}&EndDate=${endDate}`,
      {
        method: 'GET',
        headers: {
          'x-auth': `${tenantId}|${domainId}`
        }
      }
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        dispatch({
          type: constants.TIMESHEET_LIST.SUCCESS,
          payload: responseJson
        });
      })
      .catch(e => {
        dispatch({
          type: constants.TIMESHEET_LIST.ERROR,
          payload: e
        });
      });
  };
};

module.exports = {
  constants,
  getTimeSheet
};
