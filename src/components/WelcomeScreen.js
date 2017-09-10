import React, { Component } from 'react';
import { View, Image } from 'react-native';
import Button from './Button';

export default class WelcomeScreen extends Component {
  render() {
    return (
    <View style={{ alignItems: 'center', height: '100%'}}>
        <Image source={require('../images/layer_2.png')} style={{ position: 'absolute' }} />
        <Image source={require('../images/logo.png')} style={{ position: 'absolute', top: '15%' }} />
        <Image source={require('../images/logo_text.png')} style={{ position: 'absolute', top: '40%' }} />
        <Button
          style={{ position: 'absolute', top: '55%' }}
          onPress={this.props.onFirstButtonPress}
        >
          Agency
        </Button>

        <Button
          style={{ position: 'absolute', top: '64%' }}
          onPress={this.props.onSecondButtonPress}
        >
          User
        </Button>
      </View>
    );
  }
}
