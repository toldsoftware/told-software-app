import {firebaseFunctionsRootUrl} from '../config';

export const setExpoPushToken_name = 'setExpoPushToken';
export const setExpoPushToken_url = firebaseFunctionsRootUrl + '/' + setExpoPushToken_name;

export interface UserExpoPushToken {
    userKey: string;
    expoPushToken: string;
}

export interface SetExpoPushToken_RequestBody extends UserExpoPushToken {

}
