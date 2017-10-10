var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Permissions, Notifications } from 'expo';
import * as C from '../../../common/notifications/config';
const PUSH_ENDPOINT = C.setExpoPushToken_url;
export function registerForPushNotificationsAsync(userKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const { status: existingStatus } = yield Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        // only ask if permissions have not already been determined, because
        // iOS won't necessarily prompt the user a second time.
        if (existingStatus !== 'granted') {
            // Android remote notification permissions are granted during the app
            // install, so this will only ask on iOS
            const { status } = yield Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        // Stop here if the user did not grant permissions
        if (finalStatus !== 'granted') {
            return;
        }
        // Get the token that uniquely identifies this device
        let token = yield Notifications.getExpoPushTokenAsync();
        // POST the token to your backend server from where you can retrieve it to send push notifications.
        return fetch(PUSH_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: {
                    value: token,
                },
                user: {
                    userKey
                }
            }),
        });
    });
}
