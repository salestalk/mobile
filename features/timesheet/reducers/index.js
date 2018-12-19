import { REHYDRATE } from 'redux-persist/es/constants';
import { constants } from '../actions';

const initialReducerState = {
  list: [],
  loading: false,
  errorMessage: ''
};

const timeSheetReducer = (state = initialReducerState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.timesheet) {
        return action.payload.timesheet;
      }
      return initialReducerState;
    default:
      return { ...state };
  }
};

export default timeSheetReducer;
