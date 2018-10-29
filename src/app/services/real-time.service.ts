import {IRealTimeService} from "../interfaces/services/real-time-service.interface";
import {IHttpService, IPromise, IQService, IScope} from "angular";
import {AppSetting} from "../models/app-setting";

/* @ngInject */
export class RealTimeService implements IRealTimeService {

    //#region Properties

    // // Event subscriber.
    // private _subscriber: pusher.Pusher = null;
    //
    // // Channel - scope mapping.
    // private _mChannelScopeMap: { [name: string]: Channel } = {};

    //#endregion

    //#region Constructor

    // Initialize service with injectors.
    public constructor(public appSettingConstant: AppSetting,
                       public $q: IQService,
                       public $http: IHttpService) {
    }

    //#endregion

    //#region Methods

    // Subscribe user device for push notification
    public addUserDevice(deviceTokenId: string): IPromise<void> {
        let url = `${this.appSettingConstant.apiEndPoint}/api/real-time/register-device-token`;
        return this.$http
            .post(url, {deviceId: deviceTokenId})
            .then(() => {
                return void(0);
            });
    };

    //#endregion

}