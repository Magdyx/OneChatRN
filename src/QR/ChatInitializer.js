import React, {Component} from 'react' ;
import {Text} from 'react-native';
import {POST} from  '../ApiCalls';
import userService from '../DAOs/userService';
import {REQUEST_NEW_SESSION_URL, RETRIEVE_AGENCY_INFO_URL} from '../components/config';


class ChatInitializer extends Component {
    constructor(props) {
        super(props);
        this.saveResponse = this.saveResponse.bind(this);
        this.saveAgency = this.saveAgency.bind(this);
        this.state = {customerID: ''};
    }

    saveAgency(response, flag) {
        console.log("saveAgency response : ", response);
        if (flag) {
            let Channel = {
                channel_id: this.state.customerID, qr: this.AgencyPublicKey, localName: response.data.agencyName
                , status: true, image: response.data.logoURL, unreadMessages: 0, lastMessageState: 0
            };
            console.log("Channel obj :", Channel);
            let Channelresponse = userService.createChannel(Channel);
            console.log(Channelresponse);
            this.props.onQRSuccess(Channelresponse);
        }
    }

    saveResponse(response, flag) {
        console.log(response);
        if (flag) {
            this.setState({customerID: response.data.customerID});
            console.log("response.data.customerID", this.state.customerID);
            console.log("this.AgencyPublicKey: ", this.AgencyPublicKey);
            let retriveagencyinformationURL = RETRIEVE_AGENCY_INFO_URL;

            POST({agencyPublicKey: this.AgencyPublicKey}, retriveagencyinformationURL, this.saveAgency);
        }
    }

    componentWillMount() {
        console.log("in componentWillMount");
        this.AgencyPublicKey = this.props.AgencyPublicKey;
        let CustomerDeviceToken = userService.findToken()[0].value;
        let CustomerDeviceID = this.AgencyPublicKey;
        //let CustomerDeviceToken = "c4Q7HMTXaMA:AAPA91bFn4IO_fZ_Mn0-2277F_suucwM4xo3RBos82Q_lGBEzhcLvMvPJxbOjgCnHfhQDUKwt_gimbBMTDusum8UcbXmRq181T4yikvtZd0yJxcYgERtH6cD6EeP3o_evjI5n-uJBswFFp";
        //let CustomerDeviceID="BzM6iMA8RxGPXq3fLAC7bA";


        let requestnewsessionURL = REQUEST_NEW_SESSION_URL;

        let obj = {
            agencyPublicKey: this.AgencyPublicKey,
            customerDeviceToken: CustomerDeviceToken,
            customerDeviceID: CustomerDeviceID
        };
        console.log("obj :", obj);
        POST(obj, requestnewsessionURL, this.saveResponse);


    }

    render() {
        return (null);
    }
}

export default ChatInitializer;
