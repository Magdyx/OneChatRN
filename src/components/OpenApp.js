import FCM, { FCMEvent } from 'react-native-fcm';
import userService from '../DAOs/userService';
import { POST } from '../ApiCalls';

class OpenApp {

    static register(isUser) {
        FCM.requestPermissions(); // for iOS
        FCM.getFCMToken().then(token => {
            this.updateToken(token, isUser);
        });
        this.refreshTokenListener = FCM.on(FCMEvent.RefreshToken, (token) => {
            this.updateToken(token, isUser);
        });
    }

    static updateToken(token, isUser, isLoggedIn) {
        console.log("Get Token: ", token);
        // store fcm token in your server
        const response = userService.findToken();
        if (response.length === 0) {
            console.log("Empty Response");
            userService.createSetting({key: 'FCM_token', value: token});
        }
        else {
            console.log("Response Length", response.length);
            const oldToken = userService.findToken()[0].value;
            console.log("Old Token: ", oldToken);
            if (oldToken !== token) {
                console.log("Token Changed");
                userService.updateSetting({key: 'FCM_token', value: token});
                if (!isUser && isLoggedIn) {
                    console.log("Sending Token To Server");
                    const URL = "http://192.168.1.132:9998/onechat/checkagencydevice";
                    const obj = {oldAgencyDeviceToken: oldToken, newAgencyDeviceToken: token};
                    POST(obj, URL, (response, flag) => console.log("Response", response));
                } else if (isUser) {
                    console.log("Sending User Token To Server");
                    const URL = "http://192.168.1.132:9998/onechat/checkcustomerdevice";
                    const obj = {oldCustomerDeviceToken: oldToken, newCustomerDeviceToken: token};
                    POST(obj, URL, (response, flag) => console.log("Response", response));
                }
            }
        }
    }

}

export default OpenApp;