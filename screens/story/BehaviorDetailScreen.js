import React, { Component } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { colors } from '../../styles';
import { Note } from '../../components';

class BehaviorDetailScreen extends Component {
  static navigationOptions = {
    title: 'Behavior Detail',
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
      behavior: this.props.navigation.state.params,
      note: ''
    };
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.green} />
        </View>
      );
    }

    if (this.state.behavior.Name === 'notes') {
      return <Note noteId={this.state.behavior.Keyword} />;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.formLabel}>Behavior</Text>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.auth.user
  };
};

module.exports = connect(mapStateToProps)(BehaviorDetailScreen);

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
  }
});
