import {IScope} from "angular";
import {User} from "../../models/entities/user";
import {NotificationMessage} from "../../models/entities/notification-message";

export interface INavigationBarScope extends IScope {

    //#region Properties

    // User information.
    readonly profile: User | null;

    // Raise event when login is clicked.
    readonly ngClickLogin: () => void | null;

    // Raise event when sign out is clicked.
    readonly ngClickSignOut: () => void | null;

    // Raise event when profile is clicked.
    readonly ngClickProfile: () => void | null;

    // Raise event when register is clicked.
    readonly ngClickRegister: () => void | null;

    readonly ngClickSeeMessages: () => void | null;

    readonly unseenNotificationMessages: Array<NotificationMessage>;

    readonly totalUnseenNotificationMessages: number | null;

    //#endregion

    //#region Methods

    // Called when login is clicked.
    ngOnLoginClicked(): void;

    // Called when sign out is clicked.
    ngOnSignOutClicked(): void;

    // Called when profile is clicked.
    ngOnProfileClicked(): void;

    // Called when register is clicked.
    ngOnRegisterClicked(): void;

    // Called when brand is clicked.
    ngOnBrandClicked(): void;

    // Called when see more button is clicked.
    ngOnSeeMoreMessageClicked(): void;

    //#endregion
}