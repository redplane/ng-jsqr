import {LoadNotificationMessageViewModel} from "../../view-models/notification-message/load-notification-message.view-model";
import {NotificationMessage} from "../../models/entities/notification-message";
import {IPromise} from "angular";
import {SearchResult} from "../../models/search-result";

export interface INotificationMessageService {

    //#region Methods

    /*
    * Load user notification messages using specific conditions.
    * */
    loadNotificationMessages(condition: LoadNotificationMessageViewModel): IPromise<SearchResult<NotificationMessage>>;

    /*
    * Mark notification message as seen.
    * */
    markNotificationMessageAsSeen(id: string): IPromise<void>;

    //#endregion

}