import {NotificationMessageStatus} from "../../enums/notification-message-status.enum";
import {Pagination} from "../../models/pagination";

export class LoadNotificationMessageViewModel {

    //#region Properties

    public statuses: NotificationMessageStatus[] | null;

    public pagination: Pagination;

    //#endregion

    //#region Constructor

    public constructor(){
        this.statuses = null;
        this.pagination = new Pagination();
    }

    //#endregion

}