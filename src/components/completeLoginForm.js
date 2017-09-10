import React, { Component } from 'react';
import { View, Image, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Header } from '../common';
import LoginForm from './LoginForm';
import backGround from '../images/layer_2.png';

class CompleteLoginForm extends Component {

    render() {
        return(
            <View style={{flex: 1}}>
                <Image
                    style={{
                        flex: 1,
                        resizeMode: 'cover',
                        width: Dimensions.get('window').width,
                        height: Dimensions.get('window').height
                    }}
                    source={backGround}
                >
                    <TouchableWithoutFeedback onPress={this.props.navigateBack}
                                              style={{position: 'absolute', top: 20, left: 10}}>
                        <Image source={require('../images/back_copy.png')} style={{position: 'absolute', top: 20, left: 10}}/>
                    </TouchableWithoutFeedback>
                    <Header/>
                    <LoginForm
                        authenticateUser={this.props.authenticateUser}
                        success={this.props.success}
                        loading={this.props.loading}
                    />
                </Image>
            </View>
        );
    }
}

export default CompleteLoginForm;
