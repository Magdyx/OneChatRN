import React, {Component} from 'react';
import {View, Text, Button, Image, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import QRDecoder from './QRDecoder';
import ChatInitializer from './ChatInitializer';

var options = {
    title: 'Select Avatar',
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
};
class QR_UI extends Component {
    constructor(props) {
        super(props);

        this.state = {
            localImg: "",
            localImgLoaded: false,
            openCamera: false,
            initChat: false,
            publicKey: "",
            WIDTH: null,
            HEIGHT: null,
        }
    }

    measureView(layout) {
        if (this.state.HEIGHT == null && this.state.WIDTH == null) {
            this.setState({HEIGHT: layout.height, WIDTH: layout.width})
        } else {
        }

    }


    _onPresslocalBtn() {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                this.setState({localImg: "", localImgLoaded: false, openCamera: false});
            }
            else if (response.error) {
                this.setState({localImg: "", localImgLoaded: false, openCamera: false});
            }
            else {
                this.setState({localImg: response.path, localImgLoaded: true, openCamera: false})
            }
        });
    }

    _onPressopenCamera() {
        this.setState({openCamera: true, localImgLoaded: false, localImg: ""});
    }

    _onPressSkip() {
        this.setState({openCamera: false, localImgLoaded: false, localImg: ""});

    }


    renderCamera() {
        if (this.state.localImgLoaded) {
            return <QRDecoder local={true} imgSrc={this.state.localImg} onBarCodeRead={(Data) => {
                console.log(Data);
                this.setState(({localImgLoaded: false, initChat: true, publicKey: Data}))

            }
            }
            />;
        } else if (this.state.openCamera) {
            return <QRDecoder style={styles.cameraStyle} local={false}
                              width={this.state.WIDTH} height={this.state.HEIGHT}
                              onBarCodeRead={(Data) => {
                                  console.log(Data.data);
                                  this.setState(({openCamera: false, initChat: true, publicKey: Data.data}))
                              }
                              }
            />;
        }
        else {
            if (this.state.initChat) {
                return <View style={styles.mainViewStyle}>
                    <View style={styles.imageContainer}>
                        <Image style={styles.imageStyle} source={require('../images/scan_button.png')}/>
                    </View>
                    <ChatInitializer
                        onQRSuccess={this.props.onQRSuccess}
                        AgencyPublicKey={this.state.publicKey}/>
                </View>
            }


            return <View style={styles.mainViewStyle}>
                <View style={styles.imageContainer}>
                    <Image style={styles.imageStyle} source={require('../images/scan_button.png')}/>
                </View>
            </View>
        }
    }

    render() {

        return (
            <View style={{flexDirection: 'column', backgroundColor: '#fff'}}
                  onLayout={(event) => this.measureView(event.nativeEvent.layout)}
            >

                {this.renderCamera()}

                <View style={styles.buttonsAreaStyle}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={this._onPressopenCamera.bind(this)}>
                        <Text style={styles.buttonTextStyle}>Open Camera</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={this._onPresslocalBtn.bind(this)}>
                        <Text style={styles.buttonTextStyle}>Open Gallery</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonStyle} onPress={this._onPressSkip.bind(this)}>
                        <Text style={styles.buttonTextStyle}>Skip</Text>
                    </TouchableOpacity>

                </View>

                <View style={styles.textContainerStyle}>
                    <Text style={{textAlign: 'center'}}>QR codes are a great way to quickly access information,{'\n'}
                        enter competitions, setup devices, and a whole host {'\n'} of other useful shortcuts.</Text>
                </View>

            </View>
        );
    }
}

const styles = {
    cameraStyle: {
        marginTop: 10,
        height: '58%',
        width: '100%',
    },
    mainViewStyle: {
        marginTop: 10,
        backgroundColor: '#ebebeb',
        height: '58%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: 170,
        height: 170,
        borderWidth: 2,
        borderColor: '#cccccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageStyle: {
        width: 70,
        height: 126,
    },
    buttonsAreaStyle: {
        marginTop: 10,
        width: '100%',
        height: '25%',
        backgroundColor: '#fff',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    buttonStyle: {
        width: "75%",
        height: '25%',
        backgroundColor: '#44b9e0',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextStyle: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'sans-serif',
    },
    textContainerStyle: {
        backgroundColor: '#fff',
        height: '15%',
        width: '100%',
    },
}
export default  QR_UI;
