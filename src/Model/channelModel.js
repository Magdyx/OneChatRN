export default channelModelSchema = {
  name: 'Channel',
  primaryKey: 'surrogateKey',
  properties: {
      surrogateKey: {type: 'int', indexed: true},
      channel_id: 'string',
      qr: 'string',
      status: 'bool',
      latestUpdateTimeStamp: 'date',
      localName: 'string',
      favourite: 'bool',
      image: 'string',
      unreadMessages: 'int', 
      lastMessageState: 'int'
  }
}

//export default channelModel;
