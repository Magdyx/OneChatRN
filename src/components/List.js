import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View, Image, TouchableOpacity,
    ToastAndroid
} from 'react-native';
import userService from '../DAOs/userService';
import {StackNavigator, NavigationActions} from 'react-navigation';
import {syncChannels, syncMessages} from './Sync';
import ChatDetails from './List/ChatDetails';
import GenericList from './List/GenericList';
import Example from './List/Tabs';
import App from '../Chat/App';

//import Magdy from './CheckConnection/checkInternetConnection';

let usersList = [];
let agencyList = [];

function getDateFormat(time) {
    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    let timeFormat = "";
    let today = new Date();
    today.setSeconds(0);
    today.setMilliseconds(0);
    time.setSeconds(0);
    time.setMilliseconds(0);
    let diff = today.getTime() - time.getTime();
    if (today.getTime() >= time.getTime()) {
        timeFormat += "Today - ";
        timeFormat += days[time.getDay()] + " ";
    }
    else if (diff <= (24 * 60 * 60 * 1000)) {
        timeFormat += "Yesterday - ";
        timeFormat += days[time.getDay()] + " ";
    }
    else {
        timeFormat += days[time.getDay()] + " ";
    }
    timeFormat += time.getHours() + ":";
    timeFormat += time.getMinutes();
    if (time.getHours() > 12) {
        timeFormat += "PM";
    } else {
        timeFormat += "AM";
    }
    return timeFormat;
}

function renderItems(item) {
    return <ChatDetails key={item.userName} listItem={item}/>;
}

function printResponse(response) {
    console.log(response.json());
}


function _fillDatabaseWithDummyChannels() {
    let i = 0;
    while (i < 20) {
        userService.createChannel({
            channel_id: "x" + i,
            qr: '',
            status: true,
            localName: 'new user' + i,
            unreadMessages: 0,
            image: '',
            lastMessageState: 0
        });
        i++;
    }
    while (i < 40) {
        userService.createChannel({
            channel_id: "x" + i,
            qr: 'xx',
            status: true,
            localName: 'new user' + i,
            unreadMessages: 0,
            image: '',
            lastMessageState: 0
        });
        i++;
    }
}

//syncChannels();
//syncMessages();

class channelView extends Component {
    constructor() {
        super();
        this.state = {realm: null};
        this.agencyOrUser = this.agencyOrUser.bind(this);
        this.redirectToChannel = this.redirectToChannel.bind(this);
        this.renderList = this.renderList.bind(this);
        this.onScanQR = this.onScanQR.bind(this);
    }

    componentDidMount() {
        // setTimeout(()=>this.shouldRefresh(true),3000);
        const { params } = this.props.navigation.state;
        syncChannels(this.shouldRefresh.bind(this), params.isUser);
    }

    static navigationOptions = {
        title: 'One Chat',
        headerTintColor: '#FFF',
        headerStyle: {
            backgroundColor: '#05aaea'
        },
        headerRight: (
            <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                    onPress={() => console.log('Search')}
                    style={{marginRight: 20}}
                >
                    <Image source={require('../images/search.png')}/>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => console.log('Menu')}
                    style={{marginRight: 20}}
                >
                    <Image source={require('../images/more.png')}/>
                </TouchableOpacity>
            </View>
        )
    };

    redirectToChannel(channel) {
        const {navigate} = this.props.navigation;
        const {params} = this.props.navigation.state;
        console.log('to redirect to channel', channel.surrogateKey);
        navigate('Chat', {channelSurrogateKey: channel.surrogateKey, isUser: params.isUser});
        console.log('redirected to channel', channel.channel_id);
    }

    agencyOrUser() {
        agencyList = [];
        usersList = [];
        const localChannels = userService.findAllChannels();
        for (let i = 0; i < localChannels.length; i++) {
            let adaptedChannel = {
                userName: localChannels[i].localName,
                lastMessage: getDateFormat(localChannels[i].latestUpdateTimeStamp),
                numberOfUnreadMessages: localChannels[i].unreadMessages,
                onTouch: () => this.redirectToChannel(localChannels[i]),
                image: localChannels[i].image,
                key: localChannels[i].channel_id
            };
            if (localChannels[i].qr == '') {
                agencyList.push(adaptedChannel);
            } else {
                usersList.push(adaptedChannel);
            }
        }
    }

    renderList() {
        const {params} = this.props.navigation.state;
        if (params.isUser) {
            return (
                <GenericList
                    data={usersList}
                    renderItemFunction={renderItems}
                    tabLabel="User"
                    key="1"
                    isUser={true}
                    onScanQR={this.onScanQR}
                />
            );
        }
        return (
            <Example
                tabs={[
                    <GenericList
                        data={agencyList}
                        renderItemFunction={renderItems}
                        tabLabel="Agency"
                        key="1"
                        isUser={false}
                        onScanQR={this.onScanQR}
                    />,
                    <GenericList
                        data={usersList}
                        renderItemFunction={renderItems}
                        tabLabel="User"
                        key="2"
                        isUser={true}
                        onScanQR={this.onScanQR}
                    />]}
            />
        );
    }

    onScanQR() {
        const {navigate} = this.props.navigation;
        navigate('QR', {isUser: true});
    }

    shouldRefresh(syncSuccess) {
        console.log("shouldRefresh");

        if (syncSuccess) {
            userService.channelSurrogateKey = userService.findAllChannels().length + 1;
            // _fillDatabaseWithDummyChannels();
            this.agencyOrUser();
            this.forceUpdate();
            ToastAndroid.show('force update', ToastAndroid.SHORT);
        } else {
            ToastAndroid.show('Network error: couldn\'t sync with server', ToastAndroid.SHORT);
        }
    }

    render() {
        //_fillDatabaseWithDummyChannels();
        this.agencyOrUser();
        return (
            <View style={{flex: 1}}>
                <View style={{height: 2, width: '100%', backgroundColor: '#FFF'}}/>
                {this.renderList()}
            </View>

        );
    }
}

export default channelView;
