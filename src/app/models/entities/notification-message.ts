import {NotificationMessageStatus} from "../../enums/notification-message-status.enum";

export class NotificationMessage {

    //#region Properties

    public id: string;

    public ownerId: number;

    public status: NotificationMessageStatus;

    public createdTime: number;

    public extraInfo: string | null;

    public message: string;

    //#endregion

}