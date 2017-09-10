// npm install react-native-fcm --save
// react-native link react-native-fcm
// follow the step illustrated at this link https://github.com/evollu/react-native-fcm
// If an error is got during build project after following the steps, Open the android folder by Android Studio and build it.

import React, { Component } from 'react';
import { Platform } from 'react-native';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

class PushNotifications {

    static waitForNotification() {
        FCM.requestPermissions(); // for iOS
        this.notificationListener = FCM.on(FCMEvent.Notification, (notif) => {
            console.log("Notification: ", notif);
            // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
            if(notif.local_notification || notif.opened_from_tray){
                //this is a local notification
                if (notif.local_notification) {
                    console.log("Local Notification");
                }
                if (notif.opened_from_tray) {
                    console.log("Opened from Tray Notification");
                }
            } else {
                FCM.presentLocalNotification({
                    id: notif.fcm.tag,
                    title: notif.fcm.title,                             // as FCM payload
                    body: notif.fcm.body,                               // as FCM payload (required)
                    sound: "default",                                   // as FCM payload
                    priority: "normal",                                   // as FCM payload
                    color: notif.fcm.color,
                    click_action: notif.fcm.action,
                    icon: notif.fcm.icon,
                    vibrate: 500,                                       // Android only default: 300, no vibration if you pass null
                    tag: notif.fcm.tag,                                 // Android only
                    lights: true,                                       // Android only, LED blinking (default false)
                    show_in_foreground: true,                            // notification when app is in foreground (local & remote)
                });
            }

            if(Platform.OS ==='ios'){
                //optional
                //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
                //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
                //notif._notificationType is available for iOS platfrom
                switch(notif._notificationType){
                    case NotificationType.Remote:
                        notif.finish(RemoteNotificationResult.NewData); //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
                        break;
                    case NotificationType.NotificationResponse:
                        notif.finish();
                        break;
                    case NotificationType.WillPresent:
                        notif.finish(WillPresentNotificationResult.All); //other types available: WillPresentNotificationResult.None
                        break;
                }
            }
        });
    }
}

export default PushNotifications;