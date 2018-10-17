import {IController, IScope, ITimeoutService, IWindowService} from "angular";
import {IAuthorizedLayoutScope} from "./authorized-layout.scope";
import {StateService} from "@uirouter/core";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {User} from "../../../models/entities/user";
import {ILocalStorageService} from "angular-local-storage";
import {LocalStorageKeyConstant} from "../../../constants/local-storage-key.constant";
import {IRealTimeService} from "../../../interfaces/services/real-time-service.interface";
import {RealTimeConstant} from "../../../constants/real-time.constant";
import {RealTimeEventConstant} from "../../../constants/real-time-event.constant";
import {Channel} from "pusher-js";
import {Pagination} from "../../../models/pagination";
import {PaginationConstant} from "../../../constants/pagination.constant";
import {LoadNotificationMessageViewModel} from "../../../view-models/notification-message/load-notification-message.view-model";
import {INotificationMessageService} from "../../../interfaces/services/notification-message-service.interface";
import {SearchResult} from "../../../models/search-result";
import {NotificationMessage} from "../../../models/entities/notification-message";
import {NotificationMessageStatus} from "../../../enums/notification-message-status.enum";

/* @ngInject */
export class AuthorizedLayoutController implements IController {

    //#region Properties

    private _publicUserChannel: Channel;

    //#endregion

    //#region Constructors

    public constructor(public profile: User,
                       public $realTime: IRealTimeService, public $notificationMessage: INotificationMessageService,
                       public $state: StateService, public localStorageService: ILocalStorageService,
                       public $scope: IAuthorizedLayoutScope,
                       public $window: IWindowService, public $timeout: ITimeoutService,
                       public $rootScope: IScope) {

        // Properties binding
        $scope.profile = profile;

        let loadNotificationMessagePagination = new Pagination();
        loadNotificationMessagePagination.page = 1;
        loadNotificationMessagePagination.records = PaginationConstant.maxNavBarNotificationMessages;

        let loadNotificationMessagesCondition = new LoadNotificationMessageViewModel();
        loadNotificationMessagesCondition.statuses = [NotificationMessageStatus.unseen];
        loadNotificationMessagesCondition.pagination = loadNotificationMessagePagination;
        $scope.loadNotificationMessagesCondition = loadNotificationMessagesCondition;

        // Methods binding
        $scope.ngOnLoginClicked = this._ngOnLoginClicked;
        $scope.ngOnRegisterClicked = this._ngOnRegisterClicked;
        $scope.ngOnSignOutClicked = this._ngOnSignOutClicked;
        $scope.ngOnProfileClicked = this._ngOnProfileClicked;
        $scope.ngOnInit = this._ngOnInit;

    }

    //#endregion

    //#region Methods

    // Called when login is clicked.
    private _ngOnLoginClicked = (): void => {
        this.$state.go(UrlStateConstant.loginModuleName);
    };

    /*
    * Called when register is clicked.
    * */
    private _ngOnRegisterClicked = (): void => {
        this.$state.go(UrlStateConstant.accountRegisterModuleName);
    };

    // Called when sign out is clicked.
    private _ngOnSignOutClicked = (): void => {
        // Clear local storage.
        this.localStorageService.remove(LocalStorageKeyConstant.accessTokenKey);

        // Re-direct user to login page.
        this.$state.go(UrlStateConstant.loginModuleName);
    };

    // Called when profile is clicked.
    private _ngOnProfileClicked = (): void => {
        // Redirect user to profile page.
        this.$state.go(UrlStateConstant.profileModuleName, {profileId: 0});
    };

    // Register real-time channels.
    private _ngOnInit = () => {

        // Initialize real-time connection.
        this.$realTime
            .initRealTimeConnection()
            .then(() => {
                console.log('Real-time connection has been established.');

                // Broadcast an event to all component.
                this.$rootScope.$broadcast(RealTimeConstant.addRealTimeSubscriberEventConstant);

                // Hook to user channel.
                this._publicUserChannel = this.$realTime.hookChannel(RealTimeConstant.publicUserChannelName);
                this._publicUserChannel.bind(RealTimeEventConstant.addedTopic, this._ngOnPublicUserChannelRaiseEvent);
            })
            .catch(() => {
                console.log('Something wrong while establishing real-time connection.')
            });

        // Load user notification.
        this.$notificationMessage
            .loadNotificationMessages(this.$scope.loadNotificationMessagesCondition)
            .then((loadNotificationMessageResult: SearchResult<NotificationMessage>) => {
                this.$scope.loadUnreadNotificationMessagesResult = loadNotificationMessageResult;
            });
    };

    // Called when user public channel raises an event.
    private _ngOnPublicUserChannelRaiseEvent = (data: any): void => {
        console.log(data);
    };

    //#endregion
}