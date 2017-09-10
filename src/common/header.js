// import lib for Component
import React from 'react';
import { Image, View, Dimensions } from 'react-native';

//Make Component
const Header = () => {
  return (
    <View style={{ alignItems: 'center', marginBottom: 40}}>
        <Image source={require('../images/logo.png')} style={{ marginTop: 40 }}/>
        <Image source={require('../images/logo_text.png')} style={{ marginTop: 10 }} />
    </View>
  );
};

export { Header };
