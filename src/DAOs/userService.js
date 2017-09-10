import Realm from 'realm';
import channelModelSchema from '../Model/channelModel';
import settingModel from '../Model/settingModel';
import chatMessageModel from '../Model/chatMessagesModel';

let repository = new Realm({
    schema: [channelModelSchema,
        chatMessageModel,
        settingModel
    ]
});


class userService {
    static messageSurrogateKey = 0;
    static channelSurrogateKey = 0;

    /*
     for chat view
     */
    static getChannelState(channelSurrogate) {
        let channel = repository.objects('Channel').filtered(`surrogateKey = ${channelSurrogate}`);
        return channel.length != 0?channel[0].lastMessageState:null;
    }

    /*
     for chat view
     */
    static getChannelUnread(channelSurrogate) {
        let channel = repository.objects('Channel').filtered(`surrogateKey = ${channelSurrogate}`);
        return channel.length != 0?channel[0].unreadMessages:null;
    }

    /*
     create new channel in database
     channel object expecting
     */
    static createChannel(channel) {
        let newChannel;
        try{
            repository.write(() => {
                channel.surrogateKey = ++userService.channelSurrogateKey;
                channel.latestUpdateTimeStamp = new Date();
                channel.favourite = false;
                newChannel = repository.create('Channel', channel);

            });
            return newChannel;
        }
        catch(e){
            console.log("error create ch",e);
            --userService.channelSurrogateKey;
        }


    }

    /*
     create new message in database
     message object expecting:
     message_id: creating seq number
     channel_id: surrogate key of the channel holding the message
     text: message content
     status: current status of message
     createdAt: just pass new date
     chatMessageSenderType: CUSTOMER: true AGENCY:false --> how would you know? you shall not :P
     */
    static createMessage(message) {
        let messageObj;
        repository.write(() => {
            message.surrogateKey = ++userService.messageSurrogateKey;
            messageObj = repository.create('Messages', message);

        });
        return messageObj;
    }

    /*
     create new setting in database
     */
    static createSetting(setting) {
        repository.write(() => {
            repository.create('Setting', setting);
        })
    }

    /*
     set channel status to false
     called for timeout channels not sent from server to close them
     */
    static disableChannelStatus(channel) {
        repository.write(() => {
            repository.create('Channel', {surrogateKey: channel.surrogateKey, status: false}, true);
        })
    }

    /*
     return all open channels
     */
    static findAllActiveChannels() {
        return repository.objects('Channel').filtered('status = true').slice();
    }

    /*
     return all channels in the local database (for UI)
     */
    static findAllChannels() {
        return repository.objects('Channel').slice();
    }

    static findAgencyChannels() {
        return repository.objects('Channel').filtered('qr = ""');
    }

    static findCustomerChannels() {
        return repository.objects('Channel').filtered('qr != ""');
    }

    /*
     return all messages in local database
     */
    static findAllMessages() {
        return repository.objects('Messages').slice();
    }

    /*
     eh dah
     */
    static findMessage(message) {
        console.log("Message surrogateKey= " + `${message.surrogateKey}`)
        return repository.objects('Messages').filtered(`surrogateKey = "${message.surrogateKey}"`).slice();
    }

    /*
     return device token
     */
    static findToken() {
        return repository.objects('Setting').filtered('key = "FCM_token" ').slice();
    }

    /*
     used in message view
     */
    static findMessagesForChatPage(channelSurrogate, lastMessageIndex) {
        const sortBy =  [['message_id' , true]];
        return repository.objects('Messages')
            .filtered(`channel_id = ${channelSurrogate} AND message_id >= ${lastMessageIndex} `).sorted(sortBy).slice();
    }
    /*
     get greatest message id for a specific channel
     */
    static getSeqNumber(channel_id) {
        sortBy = ['message_id'];
        let channels = repository.objects('Messages').filtered(`channel_id = "${channel_id}"`)
            .sorted(sortBy);
        if (channels.length === 0)
            return 0;
        else
            return channels[channels.length - 1].message_id;
    }

    /*
     get first message id, in a channel, whose status less than 3
     */
    static getlastUnread(channel_id) {
        sortBy = ['message_id'];
        let messages = repository.objects('Messages').
        filtered(`channel_id = "${channel_id}" `);
        if (messages.length === 0)
            return 1;
        let new_messages = messages.
        filtered(" status != 3 ").sorted(sortBy);
        if(new_messages.length == 0)
            return new_messages[new_messages.length-1].message_id + 1;
        return messages[0].message_id;
    }

    /*
     return channel local name for a given surrogate key
     */
    static getChannelLocalName(channelSurrogate) {
        return repository.objects('Channel').filtered(`surrogateKey = ${channelSurrogate}`)[0].localName;
    }

    /*
     return status of last message in a particular channel
     */
    static getMessageStatus(channel_id) {
        sortBy = ['message_id'];
        let channels = repository.objects('Messages').filtered(`channel_id = ${channel_id}`)
            .sorted(sortBy);
        if (channels.length === 0)
            return 0;
        else
            return channels[channels.length - 1].status;
    }

    /*
     return (boolean) type of device user in this channel
     CUSTOMER: true AGENCY:false
     */
    static identifyType(channelSurrogate) {
        const channel = repository.objects('Channel').filtered(`surrogateKey = ${channelSurrogate}`);
        return channel[0].qr == '' ? false : true;
    }

    /*
     get the corresponding channel id to the channel surrogate key
     */
    static mapSurrogateId(surrogate) {
        console.log("in map surrogate", surrogate);
        return repository.objects('Channel').filtered(`surrogateKey = ${surrogate} `).slice()[0].channel_id;
    }

    /*
     do we need this???
     */
    static saveMessage(message) {
        repository.write(() => {
            repository.create('Message', message);
        });
    }

    static setMaxId(collectionMessage, collectionChannel) {

        let channels = userService.findAllChannels();
        let messages = userService.findAllMessages();
        if(channels.length != 0)
            userService.channelSurrogateKey = channels[channels.length - 1].surrogateKey;
        if(messages.length != 0)
            userService.messageSurrogateKey = messages[messages.length - 1].surrogateKey;

    }

    /*
     do we need this
     */
    static update(channel, callback) {
        if (!callback) return;
        repository.write(() => {
            callback();
            channel.latestUpdateTimeStamp = new Date();
        });
    }


    /*
     update unread messages, status, last message state if either is different from  a prefetched copy
     */
    static updateChannel(surrogateKey, unreadMessages, status, lastMessageState) {
        repository.write(() => {
            repository.create('Channel', {
                surrogateKey: surrogateKey,
                unreadMessages: unreadMessages,
                latestUpdateTimeStamp: new Date(),
                status: status == 'closed' ? false : true,
                lastMessageState: lastMessageState
            }, true);
        })
    }

    /*
     reset channel's number of unreaf messages
     */
    static updateChannelUnreadMessages(surrogateKey, unreadMessages) {
        repository.write(() => {
            repository.create('Channel', {surrogateKey: surrogateKey, unreadMessages: unreadMessages}, true);
        })
    }

    /*update message on server response*/
    static updateMessageOnResponse(message){
        let messageObj;
        repository.write(() => {
            messageObj=  repository.create('Messages', {
                surrogateKey: message.surrogateKey,message_id:message.message_id ,
                status: message.status, createdAt:message.createdAt}, true);
        });
        return messageObj;
    }

    /*
     update message status
     */

    static updateMessage(message) {
        repository.write(() => {
            repository.create('Messages', {
                surrogateKey: message.surrogateKey,
                status: message.status
            }, true);
        });
    }

    /*
     update status of a message if it is different from a prefetched copy
     WAIT A MINUTE?!!
     */
    static updateMessageStatus(message_id, channelSurrogate, status) {
        let message = repository.objects('Messages')
            .filtered(`message_id = "${message_id}" AND channel_id= "${channelSurrogate}"`)[0];
        repository.write(() => {
            repository.create('Messages', {
                surrogateKey: message.surrogateKey, status: status
            }, true);
        })
    }

    static updateSetting(setting) {
        repository.write(() => {
            repository.create('Setting', {key: setting.key, value: setting.value}, true);
        });
    }
}

export default userService;