import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const Button = (props) => (
    <TouchableOpacity onPress={props.onPress} style={{ ...styles.ButtonStyle, ...props.style }}>
        <Text style={styles.fontStyle}>
          {props.children}
        </Text>
    </TouchableOpacity>
);

const styles = {
  ButtonStyle: {
    width: '80%',
    height: '8%',
    backgroundColor: '#44b9e0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fontStyle: {
    fontSize: 20,
    color: '#ffff'
  }
};

export default Button;
