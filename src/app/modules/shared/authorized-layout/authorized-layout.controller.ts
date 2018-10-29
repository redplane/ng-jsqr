import {IController, IQService, IScope, ITimeoutService, IWindowService} from "angular";
import {IAuthorizedLayoutScope} from "./authorized-layout.scope";
import {StateService} from "@uirouter/core";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {User} from "../../../models/entities/user";
import {ILocalStorageService} from "angular-local-storage";
import {LocalStorageKeyConstant} from "../../../constants/local-storage-key.constant";
import {IRealTimeService} from "../../../interfaces/services/real-time-service.interface";
import {Pagination} from "../../../models/pagination";
import {PaginationConstant} from "../../../constants/pagination.constant";
import {LoadNotificationMessageViewModel} from "../../../view-models/notification-message/load-notification-message.view-model";
import {INotificationMessageService} from "../../../interfaces/services/notification-message-service.interface";
import {SearchResult} from "../../../models/search-result";
import {NotificationMessage} from "../../../models/entities/notification-message";
import {NotificationMessageStatus} from "../../../enums/notification-message-status.enum";
import {ProfileStateParam} from "../../../models/params/profile.state-param";
import * as firebase from "firebase";
import * as signalR from '@aspnet/signalr';
import {AppSetting} from "../../../models/app-setting";
import {IUserService} from "../../../interfaces/services/user-service.interface";
import {TokenViewModel} from "../../../view-models/users/token.view-model";


/* @ngInject */
export class AuthorizedLayoutController implements IController {

    //#region Constructors

    public constructor(public profile: User,
                       public appSettingConstant: AppSetting, public $q: IQService,
                       public $realTime: IRealTimeService, public $notificationMessage: INotificationMessageService,
                       public $state: StateService, public localStorageService: ILocalStorageService,
                       public $user: IUserService,
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
        $scope.ngOnSeeMessagesClicked = this._ngOnSeeMessagesClicked;

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
        let params = new ProfileStateParam();
        params.profileId = this.profile.id;
        this.$state.go(UrlStateConstant.profileModuleName, params);
    };

    // Register real-time channels.
    private _ngOnInit = () => {

        // Load user notifications.
        if (this.profile) {

            // Load notification message.
            this.$notificationMessage
                .loadNotificationMessages(this.$scope.loadNotificationMessagesCondition)
                .then((loadNotificationMessageResult: SearchResult<NotificationMessage>) => {
                    this.$scope.loadUnreadNotificationMessagesResult = loadNotificationMessageResult;
                });

            this._ngRegisterRealTimeCommunicationHandlers();
            this._ngRegisterCloudMessagingServiceWorker();
        }
    };

    // Called when see message is clicked.
    private _ngOnSeeMessagesClicked = (): void => {
        let params = new ProfileStateParam();
        params.profileId = this.$scope.profile.id;
        this.$state.go(UrlStateConstant.profileNotificationsModuleName, params);
    };

    /*
  * Register real-time
  * */
    private _ngRegisterRealTimeCommunicationHandlers(): void {
        const hubOption = this.appSettingConstant.hub;
        let connection = new signalR
            .HubConnectionBuilder()
            .withUrl(`${hubOption.baseHubEndPoint}/${hubOption.hubNotification}`, {
                accessTokenFactory: () => {
                    let authenticationToken = this.localStorageService.get<TokenViewModel>(LocalStorageKeyConstant.accessTokenKey);
                    return authenticationToken.accessToken;
                }
            })
            .build();

        connection.start()
            .then(() => {
                console.log('Real-time connection has been established.');
            });
    }

    // Register cloud messaging service worker.
    private _ngRegisterCloudMessagingServiceWorker(): void {

        // Get cloud messaging configuration.
        let cloudMessaging = this.appSettingConstant.cloudMessaging;
        if (!cloudMessaging || !cloudMessaging.messagingSenderId || !cloudMessaging.webApiKey) {
            console.log('Cloud messaging configuration is invalid. Skipping cloud messaging configuration...');
            return;
        }

        // Initialize firebase app.
        firebase
            .initializeApp({
                messagingSenderId: cloudMessaging.messagingSenderId
            });

        // Get messaging instance.
        const messaging = firebase.messaging();
        messaging.usePublicVapidKey(cloudMessaging.webApiKey);

        let firebaseServiceWorkerPath = 'firebase-messaging-sw.js';
        if (cloudMessaging.serviceWorkerPath)
            firebaseServiceWorkerPath = cloudMessaging.serviceWorkerPath;

        // Add additional data to service worker.
        firebaseServiceWorkerPath += `?messagingSenderId=${cloudMessaging.messagingSenderId}`;

        let pAddServiceWorkerTask = this.$q(resolve => {
            navigator
                .serviceWorker
                .register(firebaseServiceWorkerPath)
                .then((serviceWorkerRegistration: ServiceWorkerRegistration) => {
                    messaging.useServiceWorker(serviceWorkerRegistration);
                    resolve();
                });
        });

        // Called when firebase cloud messaging attached to a specific service worker.
        pAddServiceWorkerTask
            .then(() => {
                return messaging
                    .requestPermission();
            })
            .then(() => {
                return messaging
                    .getToken();
            })
            .then((deviceTokenId: any) => {
                console.log(`Device token = ${deviceTokenId}`);
                return this.$realTime
                    .addUserDevice(deviceTokenId);
            })
            .catch((exception) => {
                console.log('Unable to get permission to notify.', exception);
            });
    }
    //#endregion
}