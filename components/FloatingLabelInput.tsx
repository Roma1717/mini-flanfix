import React, { Component } from 'react';
import { View, TextInput, Animated, TextInputProps, StyleSheet } from 'react-native';

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
}

interface FloatingLabelInputState {
  isFocused: boolean;
}

export default class FloatingLabelInput extends Component<FloatingLabelInputProps, FloatingLabelInputState> {
  private _animatedIsFocused: Animated.Value;

  constructor(props: FloatingLabelInputProps) {
    super(props);

    this.state = {
      isFocused: false,
    };

    this._animatedIsFocused = new Animated.Value(this.props.value ? 1 : 0);
  }

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  componentDidUpdate() {
    Animated.timing(this._animatedIsFocused, {
      toValue: this.state.isFocused || this.props.value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  render() {
    const { label, ...props } = this.props;

    const labelStyle = {
      position: 'absolute' as const,
      left: 0,
      top: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [18, 0],
      }),
      fontSize: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 14],
      }),
      color: this._animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: ['#aaa', '#000'],
      }),
    };

    return (
      <View style={styles.container}>
        <Animated.Text style={labelStyle}>{label}</Animated.Text>
        <TextInput
          {...props}
          style={styles.input}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          blurOnSubmit
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    marginBottom: 20,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#A1A1A1',
    paddingHorizontal: 10,
  },
});
