import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Card, CardSection, Input, Spinner} from '../common/index';
import CheckBox from 'react-native-checkbox';

class LoginForm extends Component {

    constructor(props) {
        super();
        this.state = {email: '', password: '', error: '', loading: props.loading, checked: false};
        this.onLoginSuccess = this.onLoginSuccess.bind(this);
        this.onLoginFail = this.onLoginFail.bind(this);
    }

    onButtonPress() {
        const {email, password, checked} = this.state;
        this.setState({error: ''});
        this.props.authenticateUser(email, password, checked);
    }

    onLoginFail() {
        this.setState({error: 'Authentication Failed', password: '', loading: false});
    }

    onLoginSuccess() {
        this.setState({
            email: '',
            password: '',
            loading: false,
            error: '',
            checked: false
        });
    }

    componentWillReceiveProps(newProps) {
        console.log(newProps.success);
        if (newProps.success === 'success') {
            this.onLoginSuccess();
        } else if (newProps.success === 'failed') {
            this.onLoginFail();
        }
        this.setState({loading: newProps.loading});
    }

    renderButton() {
        if (this.state.loading) {
            return <Spinner />;
        }

        return (
            <Button onPress={this.onButtonPress.bind(this)}>
                Login
            </Button>
        );
    }

    render() {
        return (
            <Card>
                <CardSection>
                    <Input
                        placeholder="user@gmail.com"
                        label="Email"
                        value={this.state.email}
                        onChangeText={email => this.setState({email})}
                    />
                </CardSection>

                <CardSection>
                    <Input
                        secureTextEntry
                        placeholder="********"
                        label="Password"
                        value={this.state.password}
                        onChangeText={password => this.setState({password})}
                    />
                </CardSection>

                <Text style={styles.errorTextStyle}>
                    {this.state.error}
                </Text>

                <CardSection>
                    {this.renderButton()}
                </CardSection>
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                    <CheckBox
                        label='Set as primary device for notifications'
                        checked={this.state.checked}
                        onChange={(checked) => this.setState({checked: !checked})}
                    />
                </View>
            </Card>
        );
    }
}

const styles = {
    errorTextStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: 'red'
    },
    imageStyle: {
        flex: 1,
        resizeMode: 'stretch'
    },
    container: {
        flex: 1,
    },
};

export default LoginForm;
