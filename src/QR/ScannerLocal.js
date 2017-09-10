/*
npm install react-native-camera --save
react-native link react-native-camera

npm install @remobile/react-native-qrcode-local-image --save
*/


// props to this Component

// onBarCodeRead  : call back function  [required]
// showScanned : flag to show the scanned text on the screen [optional]
// scannedTexrStyle : style object for showing the scanned Text [optional]
import React, { Component } from 'react';
import { Text , View , Button , Image  } from 'react-native';
import Hello from './Hello.png';
var QRCode = require('@remobile/react-native-qrcode-local-image');



class ScannerLocal extends Component {
  constructor(props){
    super(props);
    this.state = { QR:"Waiting .." , text:"text"};
  }


  helper() {
    let Er , Res;
      QRCode.decode(this.props.imgSrc , (error, result)=>{
        Er=  JSON.stringify(error);
        Res = JSON.stringify(result)
        this.props.onBarCodeRead(result);

      });
  }

render(){
  this.helper();
  return(
    <View>


    </View>
  );

}

}
styles={
    stretch: {
  width: 50,
  height: 200
  }
}

export default ScannerLocal;
