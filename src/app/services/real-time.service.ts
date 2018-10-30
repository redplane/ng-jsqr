import {IRealTimeService} from "../interfaces/services/real-time-service.interface";
import {IHttpService, IPromise, IQService, IRootScopeService, IScope} from "angular";
import {AppSetting} from "../models/app-setting";

/* @ngInject */
export class RealTimeService implements IRealTimeService {

    //#region Properties

    // Channel - scope mapping.
    private _mChannelScopeMap: { [name: string]: IScope } = {};

    //#endregion

    //#region Constructor

    // Initialize service with injectors.
    public constructor(public appSettingConstant: AppSetting,
                       public $q: IQService,
                       public $rootScope: IRootScopeService,
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

    // Hook to a specific channel by searching for its name.
    public hookToMessageChannel(channelName: string): IScope {
        if (!this._mChannelScopeMap[channelName])
            this._mChannelScopeMap[channelName] = this.$rootScope.$new(true);

        return this._mChannelScopeMap[channelName];
    }

    // Broadcast message to a specific channel.
    public broadcastMessageToChannel<T>(channelName: string, message: string, data?: T): void {
        if (!this._mChannelScopeMap[channelName])
            return;

        let channel = this._mChannelScopeMap[channelName];
        channel.$broadcast(message, data);
    }


    //#endregion

}