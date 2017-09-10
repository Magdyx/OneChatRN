import React from 'react';
import { View } from 'react-native';

const CardSection = ({ children }) => (

  <View style={styles.containStyle}>
{children}
  </View>
);


const styles = {
containStyle: {

    padding: 5,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    position: 'relative'

  }
};

export { CardSection };
