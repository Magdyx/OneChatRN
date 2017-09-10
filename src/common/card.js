import React from 'react';
import { View } from 'react-native';

const Card = (props) => (

<View style={styles.containStyle} >
{props.children}
</View>

);

const styles = {
  containStyle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10
  }
};

export { Card };
