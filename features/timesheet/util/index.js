import moment from 'moment';
const URI = `https://salestalktech.com/SalesAcceleration/open/`;

const getTimeSheet = ({ userId, tenantId, domainId }, startDate, endDate) => {
  const url = `${URI}GetTimeSheetList?UserId=${userId}&StartDate=${encodeURI(
    startDate
  )}&EndDate=${encodeURI(endDate)}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'x-auth': `${tenantId}|${domainId}`
    }
  });
};

const getCompanyList = ({ userId, tenantId, domainId }) => {
  const url = `${URI}GetCompanyList?UserId=${userId}`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'x-auth': `${tenantId}|${domainId}`
    }
  });
};

const addTimeSheet = (
  { userId, tenantId, domainId },
  id,
  startDate,
  endDate,
  hours = 0,
  companyId,
  notes
) => {
  const params = {
    //Id: 0,
    UserId: userId,
    NormalHours: hours,
    //TrainingHours: 0,
    //OtherHours: 0,
    Description: notes,
    CompanyId: companyId,
    TaskStart: startDate,
    TaskEnd: endDate
  };

  const url = `${URI}PutTimeSheetItem?UserId=${userId}&Id=${id}&TaskStart=${encodeURI(
    startDate
  )}&TaskEnd=${encodeURI(
    endDate
  )}&NormalHours=${hours}&CompanyId=${companyId}&Description=${encodeURI(
    notes
  )}`;
  //const url = `${URI}PutTimeSheetItem`;
  return fetch(url, {
    method: 'GET',
    headers: {
      'x-auth': `${tenantId}|${domainId}`
    }
    //body: JSON.stringify(params)
  });
};

const convertToMoment = value => moment(new Date(parseInt(value.substr(6))));

module.exports = {
  convertToMoment,
  addTimeSheet,
  getCompanyList,
  getTimeSheet
};
