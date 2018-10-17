import {IScope} from "angular";
import {User} from "../../../models/entities/user";
import {LoadNotificationMessageViewModel} from "../../../view-models/notification-message/load-notification-message.view-model";
import {NotificationMessage} from "../../../models/entities/notification-message";
import {SearchResult} from "../../../models/search-result";

export interface IAuthorizedLayoutScope extends IScope {

    //#region Properties

    // Profile of current user.
    profile: User | null;

    // Condition to load notification message.
    loadNotificationMessagesCondition: LoadNotificationMessageViewModel;

    // List of notification messages belongs to user.
    loadUnreadNotificationMessagesResult: SearchResult<NotificationMessage>;

    //#endregion

    //#region Methods

    // Called when login is clicked.
    ngOnLoginClicked(): void;

    // Called when register is clicked.
    ngOnRegisterClicked(): void;

    // Called when sign out is clicked.
    ngOnSignOutClicked(): void;

    // Called when profile is clicked.
    ngOnProfileClicked(): void;

    // Called when component is initialized.
    ngOnInit(): void;

    //#endregion
}