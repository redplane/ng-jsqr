import {LoadNotificationMessageViewModel} from "../../view-models/notification-message/load-notification-message.view-model";
import {NotificationMessage} from "../../models/entities/notification-message";
import {IPromise} from "angular";
import {SearchResult} from "../../models/search-result";

export interface INotificationMessageService {

    //#region Methods

    /*
    * Load user notifications messages using specific conditions.
    * */
    loadNotificationMessages(condition: LoadNotificationMessageViewModel): IPromise<SearchResult<NotificationMessage>>;

    /*
    * Mark notifications message as seen.
    * */
    markNotificationMessageAsSeen(id: string): IPromise<void>;

    //#endregion

}