import { AsyncStorage, Alert } from 'react-native';
import { LOGIN, LOGOUT } from '../../constants';
const URI = `https://salestalktech.com/SalesAcceleration/open/login`;

export function loginRequestSuccess(user) {
  console.log('here');
  return dispatch => {
    dispatch({
      type: LOGIN.SUCCESS,
      payload: {
        user
      }
    });
  };
}

export function loginRequestError(error) {
  return dispatch => {
    dispatch({
      type: LOGIN.ERROR,
      payload: error
    });
  };
}

export function loginRequest(userName, password) {
  const payload = {
    userName,
    password
  };
  return dispatch => {
    dispatch({ type: LOGIN.PENDING });
    fetch(URI, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        return response.json();
      })
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.error.length > 0) {
          Alert.alert(
            'Invalid Credentials',
            responseJson.error,
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        } else {
          AsyncStorage.setItem('USER', JSON.stringify(responseJson.data));
          dispatch({
            type: LOGIN.SUCCESS,
            payload: responseJson.data
          });
        }
      })
      .catch(error => {
        console.log('=== Error Login ===');
        console.log(error);
        dispatch(loginRequestError('Unable to Login'));
        dispatch(resetLogin());
      });
  };
}

export function resetLogin() {
  return dispatch => {
    dispatch({ type: LOGIN.RESET });
  };
}

export function deauthorize() {
  return {
    type: LOGOUT.SUCCESS
  };
}
