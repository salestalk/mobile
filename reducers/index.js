import { persistCombineReducers } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import authReducer from './auth';
//import userReducer from './user';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'user']
};

const rootReducer = persistCombineReducers(persistConfig, {
  auth: authReducer
  //user: userReducer
});

export default rootReducer;
