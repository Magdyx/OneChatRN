import React, {Component} from 'react';
import userService from '../DAOs/userService';
import { TouchableOpacity, Image, View, ToastAndroid } from 'react-native';
import Chat from './Chat';
import _ from 'lodash';
import { syncMessages } from '../components/Sync';

/*
adapter converts list of messages for a specific channel in local database
to list of message objects as required by the ui components
 */
function messageListAdapter(channelSurrogateKey) {
    console.log('in message adapter', channelSurrogateKey);
    const localMessages = userService.findMessagesForChatPage(channelSurrogateKey, 0);
    console.log('local messages are', localMessages);
    const userOrAgencyStatus = userService.identifyType(channelSurrogateKey);
    const userId = channelSurrogateKey;
    const uiMessages = localMessages.map((message) => {
        return {
            _id: message.message_id,
            text: message.text,
            state: message.status,
            createdAt: message.createdAt,
            user: {
                _id: userOrAgencyStatus == message.chatMessageSenderType ? userId : "-2",
                name: userService.getChannelLocalName(channelSurrogateKey),
            }
        }
    })
    console.log("Messages in Adapter" , uiMessages);
    return uiMessages;
}

/*
Testing function to fill messages in local database for testing
 */
function _fillDummyMessages(channelSurrogate){
    let i = 0;
    let flag = false;
    while (i < 5) {
        console.log('To create message', i);
        userService.createMessage({
            message_id: i+1,
            channel_id: channelSurrogate,
            text: "hello message " + i,
            status: 3,
            createdAt: new Date(),
            chatMessageSenderType: flag
        });
        console.log("Message created", i);
        i++;
        flag = !flag;
    }
}

class ChatView extends Component {

    state = {messages : []};

    componentDidMount() {
        // setTimeout(()=>this.shouldRefresh(true),3000);
        const { params } = this.props.navigation.state;
        const channelSurrogateKey = params.channelSurrogateKey;
        const state = userService.getChannelState(channelSurrogateKey);
        const unreadMessages = userService.getChannelUnread(channelSurrogateKey);
        syncMessages(channelSurrogateKey, unreadMessages, state, this.shouldRefresh.bind(this))
    }

    shouldRefresh(syncSuccess) {
        console.log("shouldRefresh");

        if(syncSuccess) {
            console.log("fdkgj");
            // _fillDatabaseWithDummyChannels();
            // _fillDummyMessages2(this.state.channelSurrogateKey);
            // messageListAdapter(this.state.channelSurrogateKey);
            const { params } = this.props.navigation.state;
            this.setState({messages: messageListAdapter(params.channelSurrogateKey)});
            ToastAndroid.show('force update', ToastAndroid.SHORT);
        } else {
            ToastAndroid.show('Network error: couldn\'t sync with server', ToastAndroid.SHORT);
        }
    }

    static navigationOptions = {
        title: 'Chat',
        headerTintColor: '#FFF',
        headerStyle: {
            backgroundColor: '#05aaea'
        },
        headerRight: (<TouchableOpacity
            onPress={() => console.log('Menu')}
            style={{  marginRight: 20 }}
        >
            <Image source={require('../images/more.png')} />
        </TouchableOpacity>)
    };

    componentWillMount(){
        const { params } = this.props.navigation.state;
        const messages = messageListAdapter(params.channelSurrogateKey);
        this.setState({messages: messages});
    }

    render() {
        const { params } = this.props.navigation.state;
        console.log("Chat isUser", params.isUser);
        const channelSurrogateKey = params.channelSurrogateKey;
        console.log("Channel Surrogate Key", channelSurrogateKey);
        //_fillDummyMessages(channelSurrogateKey);
        const userId = channelSurrogateKey;
        const localName = userService.getChannelLocalName(channelSurrogateKey);

        return (
            <View style={{ flex: 1, backgroundColor: '#FFF' }}>
                <Chat messages={this.state.messages}
                      onPressAvatar={(user) => {
                          console.log(user)
                      } }
                      onMessageSend={ this.shouldRefresh.bind(this)}
                      channelId={userId}
                      userName='Ahmed'
                      isCustomer={params.isUser}
                      blocked={false}
                />
            </View>
        );
    }
}

export default ChatView;
