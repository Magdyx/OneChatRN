export default chatMessagesModel =  {
  name: 'Messages',
  primaryKey: 'surrogateKey',
  properties: {
      surrogateKey: {type: 'int', indexed: true},
      channel_id: 'int',
      message_id: {type: 'int', indexed: true},
      text: 'string',
      status: 'int',
      createdAt: 'date',
      chatMessageSenderType:'bool'
      //CUSTOMER: true AGENCY:false
  }
}
