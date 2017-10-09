export const rootUrl = 'https://us-central1-told-software.cloudfunctions.net';
export const setExpoPushToken_name = 'setExpoPushToken';
export const setExpoPushToken_url = rootUrl + '/' + setExpoPushToken_name;

export interface SetExpoPushToken_RequestBody {
    token: {
        value: string,
    },
    user: {
        userKey: string
    }
}