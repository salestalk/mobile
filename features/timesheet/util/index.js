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

const addTimeSheet = ({ userId, tenantId, domainId }, startDate, endDate) => {
  const params = {
    Id: 0,
    UserId: 0,
    NormalHours: 0,
    TrainingHours: 0,
    OtherHours: 0,
    Description: '',
    CompanyId: 0,
    TaskStart: '',
    TaskEnd: ''
  };

  const url = `${URI}PutTimeSheetItem?UserId=${userId}&StartDate=${encodeURI(
    startDate
  )}&EndDate=${encodeURI(endDate)}`;
  console.log(url);
  return fetch(url, {
    method: 'GET',
    headers: {
      'x-auth': `${tenantId}|${domainId}`
    }
  });
};

module.exports = {
  getCompanyList,
  getTimeSheet
};
