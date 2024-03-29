import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { Asset, AppLoading, Font, Icon } from 'expo';
import configureStore from './store';
import RootContainer from './screens/RootContainer';
const { store, persistor } = configureStore();
import { MainLoading } from './screens/MainLoading';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  render() {
    //this.alertIfLocationDisabledAsync()
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <PersistGate loading={MainLoading} persistor={persistor}>
            <StatusBar barStyle="light-content" />
            <RootContainer />
          </PersistGate>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([require('./assets/images/salestalk-logo-green.png')]),
      Font.loadAsync({})
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
