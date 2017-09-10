import React from 'react';
import { Text, TouchableOpacity, Dimensions } from 'react-native';

const Button = ({ onPress, children }) => (
<TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
  <Text style={styles.textStyle}> {children} </Text>
</TouchableOpacity>
);

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#66c2ff',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'transparent',
    marginLeft: 5,
    marginRight: 5,
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height / 15

  }
};

// backgroundColor: 'red',
// minHeight: 60,
// alignItems: 'center',
// justifyContent: 'center',
// borderRadius: 30

 export { Button };
