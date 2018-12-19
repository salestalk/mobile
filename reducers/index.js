import { persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import authReducer from './auth';
import timeSheetReducer from '../features/timesheet/reducers';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'timesheet']
};

const rootReducer = persistCombineReducers(persistConfig, {
  auth: authReducer,
  timesheet: timeSheetReducer
});

export default rootReducer;
