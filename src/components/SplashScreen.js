import React, {Component} from 'react';
import {View, Image, Text} from 'react-native';

class SplashScreen extends Component {
    state = {
        show: true
    };

    componentDidMount() {
        let time = this.props.delay || 3;
        time = time * 1000;
        setTimeout(() => {
            this.setState({show: false})
        }, time)
    }

    render() {
        if (this.state.show) {
            return (
                <Image source={this.props.img} style={styles.imageStyle}/>
            );
        } else {
            return (
                <View>
                    {this.props.children}
                </View>
            );
        }

    }

}
const styles = {
    imageStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: null,
        width: null
    }
}
export default SplashScreen;
