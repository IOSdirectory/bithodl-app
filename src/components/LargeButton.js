import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { ifIphoneX } from 'react-native-iphone-x-helper';
import StyledText from './StyledText';

const windowDimensions = Dimensions.get('window');
const FULL_WIDTH = windowDimensions.width;
const DEFAULT_WIDTH = FULL_WIDTH - 80;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFCA8B',
    width: DEFAULT_WIDTH,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 4
  },
  fullWidth: {
    width: FULL_WIDTH,
    borderRadius: 0,
    bottom: ifIphoneX(-24, 0)
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
    letterSpacing: 1,
    color: '#D59247'
  },
  disabled: {
    opacity: 0.4
  },
  loader: {
    height: 12,
    position: 'absolute',
    top: 15,
    left: 15
  }
});

export default class LargeButton extends Component {
  constructor(props) {
    super(...arguments);

    this.state = {
      disabled: props.disabled || false,
      loading: false,
      fullWidth: false
    };
  }

  componentDidMount() {
    /*
     * HACK: The promise from onPress might resolve and try to update state
     * after this component has been unmounted which leads to a warning.
     * One solution is to wrap the promise but this "hack" is easier in
     * this case.
     * <https://reactjs.org/blog/2015/12/16/ismounted-antipattern.html>
     */
    this._isMounted = true;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.disabled !== nextProps.disabled) {
      this.setState({
        disabled: nextProps.disabled
      });
    }

    if (this.props.fullWidth !== nextProps.fullWidth) {
      this.setState({
        fullWidth: nextProps.fullWidth
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  _onPress() {
    const onPress = this.props.onPress;
    const promise = onPress ? onPress() : null;

    if (promise instanceof Promise === false) {
      return;
    }

    this.setState({
      disabled: true,
      loading: true
    });

    promise.then(() => {
      if (!this._isMounted) {
        return;
      }

      this.setState({
        disabled: false,
        loading: false
      });
    });
  }

  render() {
    const { disabled, loading } = this.state;
    const label = loading ? this.props.loadingLabel : this.props.label;

    const buttonStyles = [
      styles.button,
      this.props.style
    ];

    if (disabled) {
      buttonStyles.push(styles.disabled);
    }

    if (this.state.fullWidth) {
      buttonStyles.push(styles.fullWidth);
    }

    return (
      <TouchableOpacity disabled={disabled} activeOpacity={0.85} onPress={this._onPress.bind(this)}>
        <View style={buttonStyles}>
          <ActivityIndicator animating={loading} color='#D59247' style={styles.loader} size='small' />
          <StyledText style={styles.label}>
            {label.toUpperCase()}
          </StyledText>
        </View>
      </TouchableOpacity>
    );
  }
}

LargeButton.propTypes = {
  label: PropTypes.string.isRequired,
  loadingLabel: PropTypes.string,
  onPress: PropTypes.func,
  style: PropTypes.any,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool
};
