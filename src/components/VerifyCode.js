import React, {Component} from 'react';
import {View, Text, TextInput, TouchableOpacity, ToastAndroid} from 'react-native';
import {POST} from '../ApiCalls';
import {NavigationActions} from 'react-navigation';
import {ASSIGN_AGENCY_DEVICE_URL} from './config';

export default class VerifyCode extends Component {
    static navigationOptions = {
        title: 'Verify Code',
        header: null
    };

    state = {code: ''};

    constructor() {
        super();
        this.verifyCodeCallBack = this.verifyCodeCallBack.bind(this);
    }

    onCancelPress() {
        const backAction = NavigationActions.back();
        this.props.navigation.dispatch(backAction);
    }

    onVerifyPress() {
        const code = this.state.code;
        if (code.length < 4) {
            ToastAndroid.show('   Your code is too short \nPlease re-check your code',
                ToastAndroid.SHORT);
        } else {
            for (let i = 0; i < 4; i++) {
                if (isNaN(code[i])) {
                    ToastAndroid.show(' Code can NOT contain \nnon-numeric characters!', ToastAndroid.SHORT);
                    return;
                }
            }
            const {params} = this.props.navigation.state;
            const URL = ASSIGN_AGENCY_DEVICE_URL;
            const obj = {
                agencyUserName: params.username, agencyPassword: params.password,
                agencyDeviceToken: params.token, confirmationCode: this.state.code
            };
            console.log(obj);
            POST(obj, URL, this.verifyCodeCallBack);
        }
    }

    verifyCodeCallBack(response, flag) {
        console.log("flag", flag);
        console.log("Verify code response", response);
        if (flag) {
            const {params} = this.props.navigation.state;
            console.log("isUser", params.isUser);
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'List', params: {isUser: params.isUser}})
                ]
            });
            this.props.navigation.dispatch(resetAction);
        } else {
            this.setState({code: ''});
            ToastAndroid.show('Invalid Verification Code!', ToastAndroid.SHORT);
        }
    }

    render() {
        const {
            mainContainerStyle,
            mainTextStyle,
            inputFieldStyle,
            descriptionTextStyle,
            VerifyButtonStyle,
            ButtonTextStyle,
            cancelTextContainerStyle,
            cancelTextStyle
        } = styles;
        return (
            <View style={mainContainerStyle}>
                <Text style={mainTextStyle}>
                    Pin Code
                </Text>
                <TextInput
                    placeholder="Code"
                    value={this.state.code}
                    onChangeText={code => this.setState({code})}
                    style={inputFieldStyle}
                    maxLength={4}
                    underlineColorAndroid='white'
                />
                <Text style={descriptionTextStyle}>
                    Enter your Pin sent on your Email {'\n'}
                    below to go to your next step
                </Text>
                <TouchableOpacity
                    style={VerifyButtonStyle}
                    onPress={this.onVerifyPress.bind(this)}
                >
                    <Text style={ButtonTextStyle}>
                        Verify
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={cancelTextContainerStyle}
                    onPress={this.onCancelPress.bind(this)}
                >
                    <Text style={cancelTextStyle}>
                        Cancel
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    mainContainerStyle: {
        height: '100%',
        width: '100%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    mainTextStyle: {
        position: 'absolute',
        fontSize: 27,
        top: '5%',
        opacity: 0.9
    },
    inputFieldStyle: {
        position: 'absolute',
        top: '25%',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#00bdd3',
        opacity: 0.8,
        height: 45,
        width: '60%',
        alignItems: 'center',
        justifyContent: 'flex-end',
        fontSize: 20,
        color: '#00bdd3',
        textAlign: 'center'
    },
    descriptionTextStyle: {
        position: 'absolute',
        top: '45%',
        alignItems: 'center',
        textAlign: 'center',
        opacity: 0.6
    },
    VerifyButtonStyle: {
        position: 'absolute',
        top: '70%',
        height: 45,
        width: '90%',
        backgroundColor: '#05aaea',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ButtonTextContainerStyle: {
        color: '#fefefe',
        fontSize: 20
    },
    ButtonTextStyle: {
        color: '#fefefe',
        fontSize: 20
    },
    cancelTextContainerStyle: {
        position: 'absolute',
        top: '90%'
    },
    cancelTextStyle: {
        color: '#99262262',
        textDecorationLine: 'underline'
    }
};
