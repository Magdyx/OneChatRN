import React, { Component } from 'react';
import { View } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';
import { StackNavigator, NavigationActions } from 'react-navigation';
import SplashScreen from './SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import OpenApp from './components/OpenApp';
import PushNotifications from './components/PushNotifications';
import LoginForm from './components/completeLoginForm';
import VerifyCode from './components/VerifyCode';
import { POST } from './ApiCalls';
import UserService from './DAOs/userService';
import QR_UI from './QR/QR_UI';
import List from './components/List';
import Chat from './Chat/App';
import {LOGIN_AGENCY_URL} from './components/config';

class Home extends Component {

    constructor() {
        super();
        this.onAgencyClicked = this.onAgencyClicked.bind(this);
        this.onUserClicked = this.onUserClicked.bind(this);
    }

    static navigationOptions = {
        title: 'Home',
        header: null
    };

    componentWillMount() {
        PushNotifications.waitForNotification();
        UserService.setMaxId(UserService.findAllMessages(), UserService.findAllChannels());
    }

    render() {
        return(
            <SplashScreen>
                <WelcomeScreen onFirstButtonPress={this.onAgencyClicked} onSecondButtonPress={this.onUserClicked}/>
            </SplashScreen>
        );
    }

    onAgencyClicked() {
        OpenApp.register(false);
        const { navigate } = this.props.navigation;
        navigate('Login', { isUser: false });
    }

    onUserClicked() {
        OpenApp.register(true);
        const response = UserService.findAllChannels();
        if (response.length > 0) {
            const {navigate} = this.props.navigation;
            navigate('List', {isUser: true});
        } else {
            const {navigate} = this.props.navigation;
            navigate('QR', {isUser: true});
        }
    }
}

class Welcome extends Component {

    constructor() {
        super();
        this.onAgencyClicked = this.onAgencyClicked.bind(this);
        this.onUserClicked = this.onUserClicked.bind(this);
    }

    static navigationOptions = {
        title: 'Welcome',
        header: null
    };

    render() {
        return(
            <WelcomeScreen onFirstButtonPress={this.onAgencyClicked} onSecondButtonPress={this.onUserClicked}/>
        );
    }

    onAgencyClicked() {
        OpenApp.register(false);
        const { navigate } = this.props.navigation;
        navigate('Login', { isUser: false });
    }

    onUserClicked() {
        OpenApp.register(true);
        const response = UserService.findAllChannels();
        if (response.length > 0) {
            const {navigate} = this.props.navigation;
            navigate('List', {isUser: true});
        } else {
            const {navigate} = this.props.navigation;
            navigate('QR', {isUser: true});
        }
    }

}

class Login extends Component {

    static navigationOptions = {
        title: 'Login',
        header: null
    };

    constructor() {
        super();
        this.state = {
            checked: false,
            success: 'start',
            loading: false,
            username: '',
            password: ''
        };
        this.authenticateUser = this.authenticateUser.bind(this);
        this.apiCallBack = this.apiCallBack.bind(this);
        this.navigateBack = this.navigateBack.bind(this);
    }

    render() {
        return(
            <LoginForm
                loading={this.state.loading}
                success={this.state.success}
                navigateBack={this.navigateBack}
                authenticateUser={this.authenticateUser} />
        );
    }

    navigateBack() {
        const backAction = NavigationActions.back();
        this.props.navigation.dispatch(backAction);
    }

    authenticateUser(email, password, checked) {
        console.log("Email", email);
        console.log("Password", password);
        console.log("Checked", checked);
        this.setState({checked, loading: true, success: 'start', username: email, password: password});
        const obj = { agencyUserName: email, agencyPassword: password, isPrimaryDevice: checked };
        const URL = LOGIN_AGENCY_URL;
        POST(obj, URL, this.apiCallBack);
    }

    apiCallBack(response, flag) {
        console.log(response);
        if (flag) {
            this.setState({success: 'success', loading: false});
            if (this.state.checked) {
                FCM.requestPermissions(); // for iOS
                FCM.getFCMToken().then(token => {
                    const { navigate } = this.props.navigation;
                    const { params } = this.props.navigation.state;
                    console.log("Login : isUser", params.isUser);
                    navigate('Verify', {username: this.state.username, password: this.state.password, token, isUser: params.isUser});
                });
                this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
                    const { navigate } = this.props.navigation;
                    const { params } = this.props.navigation.state;
                    console.log("isUser", params.isUser);
                    navigate('Verify', {username: this.state.username, password: this.state.password, token, isUser: params.isUser});
                });
            } else {
                const { params } = this.props.navigation.state;
                console.log("Login : isUser", params.isUser);
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: 'List', params: { isUser: params.isUser }})
                    ]
                });
                this.props.navigation.dispatch(resetAction);
            }
        } else {
            this.setState({success: 'failed', loading: false});
        }
    }

    componentWillUnmount() {
        // stop listening for events
        if (this.refreshTokenListener) {
            this.refreshTokenListener.remove();
        }
    }
}

class QR extends Component {

    constructor(){
        super();
        this.onQRSuccess = this.onQRSuccess.bind(this);
    }

    static navigationOptions = {
        title: 'Scan QR',
        headerTintColor: '#FFF',
        headerStyle: {
            backgroundColor: '#05aaea'
        }
    };

    render() {
        return(<QR_UI onQRSuccess={this.onQRSuccess}/>);
    }

    onQRSuccess(channel) {
        const { navigate } = this.props.navigation;
        navigate('Chat', {channelSurrogateKey: channel.surrogateKey, isUser: true});
    }
}

const App = StackNavigator({
    Home: { screen: Home },
    Welcome: { screen: Welcome },
    Login: { screen:  Login },
    Verify: { screen: VerifyCode },
    QR: { screen: QR },
    List: { screen: List },
    Chat: { screen: Chat }
});

export default App;
