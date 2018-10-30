import {IPromise, IScope} from "angular";

export interface IRealTimeService {

    //#region Methods

    // Add user device for push notification.
    addUserDevice(deviceTokenId: string): IPromise<void>;

    // Hook to a specific chanel by searching for its name.
    hookToMessageChannel(channelName: string): IScope;

    // Broadcast message to a specific channel.
    broadcastMessageToChannel<T>(channelName: string, message: string, data?: T): void;

    //#endregion
}