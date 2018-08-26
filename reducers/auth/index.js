import { REHYDRATE } from 'redux-persist/es/constants';
import { LOGIN, LOGOUT } from '../../constants';

const initialReducerState = {
  user: false,
  awaitingTransition: false,
  errorMessage: ''
};

const authReducers = (state = initialReducerState, action) => {
  switch (action.type) {
    case REHYDRATE:
      if (action.payload && action.payload.auth) {
        return action.payload.auth;
      }
      return initialReducerState;
    case LOGIN.SUCCESS:
      return {
        ...state,
        user: action.payload,
        awaitingTransition: false
      };
    case LOGOUT.SUCCESS:
      return {
        ...state,
        user: null,
        awaitingTransition: false
      };
    case LOGIN.PENDING:
      return {
        ...state,
        awaitingTransition: true
      };
    case LOGIN.ERROR:
      return {
        ...state,
        errorMessage: action.payload
      };
    case LOGIN.RESET:
      return {
        ...state,
        errorMessage: '',
        awaitingTransition: false,
        user: null
      };
    default:
      return { ...state };
  }
};

export default authReducers;
