import {IScope} from "angular";
import {Category} from "../../../../models/entities/category";
import {LoadNotificationMessageViewModel} from "../../../../view-models/notification-message/load-notification-message.view-model";
import {SearchResult} from "../../../../models/search-result";
import {NotificationMessage} from "../../../../models/entities/notification-message";

export interface IProfileNotificationScope extends IScope{

    //#region Properties

    loadNotificationMessagesCondition: LoadNotificationMessageViewModel;

    loadNotificationMessagesResult: SearchResult<NotificationMessage>;

    //#endregion

    //#region Methods

    // Called when component is initialized.
    ngOnInit(): void;

    // Called when load following categories is changed.
    ngOnPageChanged(): void;

    // Get category from id.
    ngGetCategory(id: number): Category;

    //#endregion

}