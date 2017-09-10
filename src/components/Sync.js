import {POST, GET} from '../ApiCalls';
import userService from '../DAOs/userService';
import _ from 'lodash';
import {SYNC_RETRIEVE_MESSAGES_URL, SYNC_OPEN_CHANNELS_URL} from './config';

function printChannels(channels) {
    console.log("length: ", channels.length);
    _.forEach(channels, function (channel) {
        console.log("channel", channel.channel_id, "unreadMessages", channel.unreadMessages,
            "surroget ", channel.surrogateKey, "status ", channel.status, channel.lastMessageState);
    })
}

function printMessages(channels) {
    console.log("length: ", channels.length);
    _.forEach(channels, function (channel) {
        console.log("message surr", channel.surrogateKey, "channel surr", channel.channel_id,
            "status ", channel.status, channel.message_id, channel.text);
    })
}

function syncChannels(shouldRefresh, isUser) {
    // const obj = {agencyDeviceToken: userService.findToken(), type: "AGENCY"};
    // const URL = SYNC_OPEN_CHANNELS_URL;
    // POST(obj, URL, (response, flag) => compareChannels(response, flag, shouldRefresh, false));
    let obj;
    const token = userService.findToken();
    const URL = SYNC_OPEN_CHANNELS_URL;
    if(!isUser) {
        obj = {
            agencyDeviceToken: token,
            customerDeviceToken: "",
            type: "AGENCY"
        };
        POST(obj, URL, (response, flag) => compareChannels(response, flag, shouldRefresh, false));
    }
    obj = {
        agencyDeviceToken: "",
        customerDeviceToken: token,
        type: "CUSTOMER"
    };
    POST(obj, URL, (response, flag) => compareChannels(response, flag, shouldRefresh, true));

}

function syncChannelsDummy(shouldRefresh, isUser) {
    let obj;
    const token = userService.findToken();
    const URL = SYNC_OPEN_CHANNELS_URL;
    if(!isUser) {
        obj = {
            agencyDeviceToken: token,
            customerDeviceToken: "",
            type: "AGENCY"
        };
        POST(obj, URL, (response, flag) => compareChannels(response, flag, ()=>{}, false));
    }
    obj = {
        agencyDeviceToken: "",
        customerDeviceToken: token,
        type: "CUSTOMER"
    };
    POST(obj, URL, (response, flag) => compareChannels(response, flag, shouldRefresh, true));

}

function compareChannels(response, flag, shouldRefresh, isUser) {
    let change = false;
    console.log("flag: ", flag);
    console.log(response);
    if (!flag) {
        shouldRefresh(false);
        return;
    }
    console.log("remote channels", response.data.openChannelsIDs);
    let localChannels = [];
    if(isUser){
        console.log("Customer");
        localChannels = userService.findCustomerChannels();
    } else {
        console.log("agency");
        localChannels = userService.findAgencyChannels();
    }
    console.log('local channels');
    printChannels(localChannels);
    const remoteChannels = response.data.openChannelsIDs;
    let surrogate = localChannels.length;
    let count2 = 0;
    const localChannelsLength = localChannels.length;

    let timeoutFlags = [];
    for (let counter = 0; counter < localChannelsLength; counter++) {
        timeoutFlags.push(false);
    }
    console.log("timeout flags", timeoutFlags);

    console.log("Channels Before", userService.findAllChannels());
    //printChannels(userService.findAllChannels());


    for (let i = 0; i < remoteChannels.length; i++) {
        let channel = remoteChannels[i];
        let found = false;

        // console.log("Messages Before" , userService.findAllMessages().slice()[17].message_id, " " ,userService.findAllMessages().slice()[17].status );
        for (let count = 0; count < localChannelsLength; count++) {
            let localChannel = localChannels[count];
            if (channel.sessionId === localChannel.channel_id) {
                found = true;
                timeoutFlags[count] = true;
                let unreadMessages = null;
                console.log("from for");

                const localSeqNumber = userService.getSeqNumber(localChannel.surrogateKey);

                if (channel.seqNumber > localSeqNumber || (channel.status == "closed" && localChannel.status)) {
                    console.log("channel.seqNumber > localSeqNumber");
                    unreadMessages = channel.seqNumber - localSeqNumber;
                    userService.updateChannel(localChannel.surrogateKey, unreadMessages, channel.status, channel.state);
                    change = true;
                }
                console.log('before break', found);
                break;
            }
        }

        if (!found) {
            console.log('a channel not found', channel.sessionId);
            const new_channel = {
                channel_id: channel.sessionId,
                qr: '',
                status: channel.status == 'closed' ? false : true,
                localName: 'new user',
                unreadMessages: channel.seqNumber,
                image: '', //TODO
                lastMessageState: channel.state

            }
            console.log('channel id ', channel.sessionId);
            userService.createChannel(new_channel);
            console.log('channel id created', channel.sessionId);
            change = true;
        }


    }

    console.log("flags after", timeoutFlags);
    for (let counter = 0; counter < localChannelsLength; counter++) {
        if (!timeoutFlags[counter]) {
            console.log('closing channel number', counter, "not surrogate");
            userService.disableChannelStatus(localChannels[counter]);
            console.log('channel number ', counter, "closed");
            change = true;
        }
    }

    console.log("Channels After", userService.findAllChannels());
    //printChannels(userService.findAllChannels());


    if (change)
        shouldRefresh(true);

}

function syncMessages(channelSurrogate, unreadMessages, state, shouldRefresh) {
    if (unreadMessages == 0 && userService.getMessageStatus(channelSurrogate) == state) {
        console.log("hi from if: detected no unread messages or change in state => don't sync");
        return;
    }
    const URL = SYNC_RETRIEVE_MESSAGES_URL;
    const lastMessageIndex = userService.getlastUnread(channelSurrogate);
    const channel_id = userService.mapSurrogateId(channelSurrogate);
    const obj = {
        "senderID": channel_id,//"NxoPHSD1QP2LHfPqYvc6AA", /// TODO channel_id
        "fromMessageSequence": lastMessageIndex + ""
    }
    POST(obj, URL, (response, flag) => {
        compareMessages(response, channelSurrogate, shouldRefresh, flag)
    });
}

/*

 */
function compareMessages(response, channelSurrogate, shouldRefresh, flag) {
    let change = false;
    console.log("response", response);
    if (!flag) {
        shouldRefresh(false);
        return;
    }
    console.log("hello from compare messages");
    const remoteMessages = response.data.chatMessages;
    console.log("All messages");
    printMessages(userService.findAllMessages());
    console.log('remote messages', remoteMessages);
    const maxMessageSeq = userService.getSeqNumber(channelSurrogate);
    console.log("maxMessageSeq ", maxMessageSeq);
    for (let count = 0; count < remoteMessages.length; count++) {
        //get this message to update it's status
        if (remoteMessages[count].messageSequence <= maxMessageSeq && maxMessageSeq != 0) {
            console.log("here 2", count);
            //TODO
            //need to check for different status first
            change = true;
            userService.updateMessageStatus(remoteMessages[count].messageSequence, channelSurrogate,
                remoteMessages[count].state);
        }

        //Create this message if not found in local
        else {
            console.log("surroget", userService.messageSurrogateKey);
            change = true;
            console.log("from else ", count);
            const message = remoteMessages[count];
            const new_message = {
                message_id: message.messageSequence,
                channel_id: channelSurrogate,
                text: message.messageontents,
                status: message.state,
                createdAt: new Date(message.messageTimestamp),
                chatMessageSenderType: (message.chatMessageSenderType == "CUSTOMER") ? true : false
            }
            const new_m = userService.createMessage(new_message);
            console.log("new message", new_m);
        }

    }
    console.log("All messages", userService.findAllMessages());
    userService.updateChannelUnreadMessages(channelSurrogate, 0);
    if (change) {
        shouldRefresh(true);
    }
}

export {syncChannels, syncMessages};
