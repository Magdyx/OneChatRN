import React from 'react';
import { View, Image } from 'react-native';

const DisplayImage = () => (
       <View>
        <Image
          style={{ width: 50, height: 50 }}
          source={{ uri: 'https://facebook.github.io/react/img/logo_og.png' }}
        />
      </View>
    );


export { DisplayImage };
