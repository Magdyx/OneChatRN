import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import ChatDetails from './ChatDetails';

class ChatList extends Component {

  constructor(props) {
    super(props);
    this.state = { list: props.list };
  }

 /*
  constructor() {
    super();
    this.setState = {};
  }
  */
  renderList() {
    return this.state.list.map(listItem =>
      <ChatDetails key={listItem.UserName} listItem={listItem} />);
  }

  render() {
    return (
      <ScrollView>
        { this.renderList() }
      </ScrollView>
    );
  }
}

export default ChatList;
