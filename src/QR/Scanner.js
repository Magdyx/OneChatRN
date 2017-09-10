/*
npm install react-native-camera --save
react-native link react-native-camera
*/


// props to this Component
// onQRCodeRead  : call back function  [required]
// showScanned : flag to show the scanned text on the screen [optional]
// scannedTexrStyle : style object for showing the scanned Text [optional]
import React, { Component } from 'react';
import { Text , View  } from 'react-native';
import Camera from 'react-native-camera';
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';
  let topLeft="50,0 0,0 0,50"  , topRight="50,0 0,0 0,50"
   , bottomLeft="50,0 0,0 0,50" , bottomRight="50,0 0,0 0,50" ;
class Scanner extends Component {
  constructor(props){
    super(props);

  }







//"0,0 340,0  340,242 0,242  0,0"
render(){
  let WIDTH = (this.props.width)-60 ;
  let HEIGHT = (this.props.height *.58)- 60;
  topLeft="50,0 0,0 0,50";
  bottomRight = (WIDTH-50) + ","+HEIGHT+" " + WIDTH+","+HEIGHT +" " + WIDTH +"," + (HEIGHT-50) ;
  bottomLeft = "0,"+(HEIGHT-50)+" 0," +HEIGHT + " 50," +HEIGHT;
  topRight = (WIDTH-50) + ",0 " + WIDTH+",0 " + WIDTH+",50" ;
  console.log("in render");

  return(
    <View style={this.props.style}>

        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          onBarCodeRead={this.props.onBarCodeRead}
          barCodeTypes={['qr']}>
          <View style={styles.div1}>
          <Svg height={HEIGHT} width={WIDTH} >
            <Polyline
              points={topLeft}
              fill="none"
              stroke="white"
              strokeWidth="5"
            />

            <Polyline
              points={topRight}
              fill="none"
              stroke="white"
              strokeWidth="5"
            />
            <Polyline
              points={bottomLeft}
              fill="none"
              stroke="white"
              strokeWidth="5"
            />
            <Polyline
              points={bottomRight}
              fill="none"
              stroke="white"
              strokeWidth="5"
            />
          </Svg>
          </View>
        </Camera>


    </View>
  );
}
}



//  backgroundColor: 'rgba(120, 120, 120, .6)',
const styles={
  preview: {
    width: '100%',
    height: '100%',
  },
  div1: {
    flex:1,

    borderWidth : 30,
    borderStyle : 'solid',
    borderColor : 'rgba(0, 0, 0, .4)',
},

div2: {
  position:"relative",
  top:0,
  left:0,
  borderRadius: 15,
}
};

export default Scanner;
