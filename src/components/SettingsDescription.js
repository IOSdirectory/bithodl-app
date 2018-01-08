import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import StyledText from './StyledText';

const styles = StyleSheet.create({
  description: {
    color: '#6D6D72',
    fontSize: 13,
    lineHeight: 17,
    marginTop: -20,
    marginBottom: 30,
    paddingRight: 15,
    paddingLeft: 15
  }
});

export default class SettingsDescription extends Component {
  render() {
    return (
      <StyledText style={styles.description}>
        {this.props.children}
      </StyledText>
    );
  }
}

SettingsDescription.propTypes = {
  children: PropTypes.node
};
