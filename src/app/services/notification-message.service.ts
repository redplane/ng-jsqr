import {INotificationMessageService} from "../interfaces/services/notification-message-service.interface";
import {LoadNotificationMessageViewModel} from "../view-models/notification-message/load-notification-message.view-model";
import {NotificationMessage} from "../models/entities/notification-message";
import {IHttpResponse, IHttpService, IPromise} from "angular";
import {AppSetting} from "../models/app-setting";
import {SearchResult} from "../models/search-result";

export class NotificationMessageService implements INotificationMessageService {

    //#region Constructor

    public constructor(public appSettingConstant: AppSetting,
                       public $http: IHttpService) {
    }

    //#endregion

    //#region Methods

    /*
    * Load notification messages using specific conditions.
    * */
    public loadNotificationMessages(condition: LoadNotificationMessageViewModel): IPromise<SearchResult<NotificationMessage>> {
        const fullUrl = `${this.appSettingConstant.apiEndPoint}/api/notification-message/search`;
        return this.$http
            .post(fullUrl, condition)
            .then((loadNotificationMessageResponse: IHttpResponse<SearchResult<NotificationMessage>>) => {
                if (!loadNotificationMessageResponse || !loadNotificationMessageResponse.data)
                    throw 'Cannot load notification messages.';

                return loadNotificationMessageResponse.data;
            });
    };

    /*
    * Mark notification message as read by searching for its id.
    * */
    public markNotificationMessageAsSeen(id: string): IPromise<void> {
        const fullUrl = `${this.appSettingConstant.apiEndPoint}/api/notification-message/mark-as-seen/${id}`;
        return this.$http
            .put(fullUrl, null)
            .then(() => {
                return void(0);
            });
    }

    //#endregion

}