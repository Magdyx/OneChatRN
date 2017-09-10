import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import Card from './Card';
import CardSection from './CardSection';


const ChatDetails = ({ listItem }) => {
  let {
    lastMessage = '',
    userName = 'User',
    image = 'https://pbs.twimg.com/profile_images/601806103748292608/ZNJrNntN.jpg',
    numberOfUnreadMessages = 0,
    onTouch
  } = listItem;
  const { headerTextStyle, thumbnailContainerStyle,
    thumbnailStyle, containerStyle, numberOfUnreadMessagesStyle, timeStyle } = styles;

  const renderCircle = () => {
    if (numberOfUnreadMessages !== 0) {
      if (numberOfUnreadMessages < 9) {
        return (
          <View style={numberOfUnreadMessagesStyle}>
            <Text style={{ color: 'white', fontSize: 14 }}>
              { numberOfUnreadMessages }
            </Text>
          </View>
        );
      }
      return (
        <View style={numberOfUnreadMessagesStyle}>
          <Text style={{ color: 'white', fontSize: 12 }}>
            9+
          </Text>
        </View>
      );
    }
  };

  return (
    <TouchableOpacity onPress={() => { onTouch(userName); numberOfUnreadMessages = 0; }} >
    <Card>
        <CardSection>
          <View style={thumbnailContainerStyle}>
            <Image
            source={{ uri: image }}
            style={thumbnailStyle}
            />
          </View>
          <View style={containerStyle}>
            <Text style={headerTextStyle}>{userName}</Text>
            <Text style={timeStyle}>{lastMessage}</Text>
          </View>
          <TouchableOpacity
            style={{ position: 'absolute', right: 20, height: 60, justifyContent: 'center' }}
            
          >
            <Image source={require('./more_cell.png')} />
          </TouchableOpacity>
        </CardSection>
          {renderCircle()}
    </Card>
    </TouchableOpacity>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  thumbnailStyle: {
    height: 50,
    width: 50,
    borderRadius: 50
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10
  },
  headerTextStyle: {
    fontSize: 20
  },
  numberOfUnreadMessagesStyle: {
    position: 'relative',
    backgroundColor: 'red',
    height: 20,
    width: 20,
    top: -55,
    left: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
    timeStyle: {
      fontSize: 12
    }
};

export default ChatDetails;
