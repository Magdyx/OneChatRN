import React, { Component } from 'react';
import { Text , View  } from 'react-native';
import Scanner from './Scanner';
import ScannerLocal from './ScannerLocal';


class QRDecoder extends Component{

  // props to this Component
  //loacal: flag to to use an existing img
  // onBarCodeRead  : call back function  [required]
  // showScanned : flag to show the scanned text on the screen [optional]
  // scannedTexrStyle : style object for showing the scanned Text [optional]
  /* in case local img
  // imgSrc [Required]
  // onBarCodeRead  : call back function  [required]
  */
  constructor(props){
    super(props)
  }

  helper(){


  }
  render(){
    let x ;
    if(this.props.local){
    return <ScannerLocal imgSrc={this.props.imgSrc} onBarCodeRead = {this.props.onBarCodeRead} />;

    }else{
    return  <Scanner style={this.props.style}
      width={this.props.width} height={this.props.height}
     onBarCodeRead={this.props.onBarCodeRead} />;
    }
  }
}

QRDecoder.defaultprops={
  local:false,
}
export default QRDecoder;
