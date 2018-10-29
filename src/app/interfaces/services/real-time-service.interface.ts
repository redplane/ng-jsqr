import {IPromise} from "angular";

export interface IRealTimeService {

    //#region Methods

    // Add user device for push notification.
    addUserDevice(deviceTokenId: string): IPromise<void>;

    //#endregion
}