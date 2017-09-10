import React, { Component } from 'react';
import { FlatList, View, TouchableOpacity, Image } from 'react-native';

export default class GenericList extends Component {

    constructor(){
        super();
    }

    renderQR() {
        if (this.props.isUser) {
            return (
                <TouchableOpacity
                    onPress={this.props.onScanQR}
                    style={{ position: 'absolute', bottom: 10, right: 10 }}
                >
                    <Image
                        source={require('../../images/qr_code.png')}
                    />
                </TouchableOpacity>
            );
        }
        return null;
    }

  render() {
    return (
      <View style={{ flex: 1 }} >
        <FlatList
          data={this.props.data}
          extraData={this.props.extraData}
          renderItem={(item) => {
            return this.props.renderItemFunction(item.item);
          }
          }
        />
          {this.renderQR()}
      </View>
    );
  }
}
