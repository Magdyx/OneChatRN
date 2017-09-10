import React, { Component } from 'react';
import { View, Text } from 'react-native';
import SplashScreen from './components/SplashScreen';
import Welcome from './components/WelcomeScreen';

class WelcomeScreen extends Component {

    render() {
        return(
            <SplashScreen
                img={require('./images/one_chat_splash_screen.png')}
                delay={4}>
                {this.props.children}
            </SplashScreen>
        );
    }
}

export default WelcomeScreen;