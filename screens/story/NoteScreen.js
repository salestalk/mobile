import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { FormLabel, FormInput, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { BASE_URL } from '../../constants';

class NoteScreen extends Component {
  static navigationOptions = {
    title: 'Add Note',
    headerTintColor: colors.white,
    headerStyle: {
      backgroundColor: colors.green
    },
    headerBackTitle: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      contact: this.props.navigation.state.params,
      note: '',
      notePayload: {
        src: 'Mobile App',
        crmAccountId: null,
        crmOpportunityId: null,
        leadLifeLeadId: this.props.navigation.state.params.leadId,
        sessionId: '2e75810a-c4d8-449a-9256-ac5d1a68dda7',
        pageUrl: '',
        type: 'Conversation',
        name: 'notes',
        behaviorId: 0,
        isFinal: false,
        noteId: '0',
        content: '',
        createdBy: this.props.user.userId,
        talkingPointName: '',
        crmEntityType: 'Agent Notes'
      }
    };
  }

  componentDidMount() {}

  _onSavePressed = () => {
    this.setState({ isLoading: true });
    var payload = this.state.notePayload;
    payload.content = this.state.note;

    fetch(`${BASE_URL}open/putnote`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
      },
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        if (responseJson.error.length > 0) {
          Alert.alert(
            'Error Saving Note Please Try Again',
            responseJson.error,
            [{ text: 'OK', onPress: () => {} }],
            { cancelable: false }
          );
        } else {
          if (this.props.navigation.state.params.updateActivities !== void 0) {
            this.props.navigation.state.params.updateActivities();
          }
          this.props.navigation.goBack(null);
        }
      })
      .catch(error => {
        console.log(error);
      });

    setTimeout(() => {
      this.props.navigation.goBack(null);
    }, 1000);
  };

  _nameChanged = () => {};

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <Text style={styles.formLabel}>Enter Note Below:</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          numberOfLines={5}
          onChangeText={note => this.setState({ note })}
          value={this.state.name}
        />
        <Button
          backgroundColor={colors.green}
          stye={styles.saveButton}
          icon={{
            name: 'save',
            type: 'material',
            buttonStyle: styles.someButtonStyle
          }}
          title="Save Note"
          onPress={this._onSavePressed}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(NoteScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    padding: 10
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  formLabel: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5,
    marginHorizontal: 15,
    color: 'rgba(0,0,0,0.8)'
  },
  textInput: {
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 16,
    height: 240,
    padding: 5,
    marginHorizontal: 15,
    marginBottom: 20,
    color: 'rgba(0,0,0,0.8)'
  },
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: colors.green
  },
  date: {
    color: '#777',
    fontSize: 12
  }
});
