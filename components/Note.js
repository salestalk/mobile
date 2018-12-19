import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../styles';
import { BASE_URL } from '../constants';

export default class Note extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noteId: props.noteId,
      note: {
        Content: 'THis is a note'
      }
    };
  }

  componentWillMount() {
    this.setState({ isLoading: true });
    this._loadNoteContent();
  }

  _loadNoteContent = () => {
    return fetch(`${BASE_URL}open/getnote/${this.state.noteId}`, {
      method: 'GET',
      headers: {
        'x-auth': `${this.props.user.tenantId}|${this.props.user.domainId}`
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({
          isLoading: false,
          note: responseJson
        });
      })
      .catch(error => {
        this.setState({
          isLoading: false
        });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.formLabel}>NOTE</Text>
        <Text style={styles.description}>{this.state.note.Content}</Text>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(Note);

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
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 0,
    color: colors.green
  },
  description: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 30
  }
});
