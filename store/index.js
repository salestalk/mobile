import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import reduxThunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import rootReducer from '../reducers';

const logger = createLogger({
  collapsed: true,
  duration: true
});

export default () => {
  let middleware = [reduxThunk];
  if (__DEV__) middleware = [...middleware, logger];

  let store = createStore(
    rootReducer,
    undefined,
    compose(applyMiddleware(...middleware))
  );
  let persistor = persistStore(store, null, () => store.getState());
  return { store, persistor };
};
