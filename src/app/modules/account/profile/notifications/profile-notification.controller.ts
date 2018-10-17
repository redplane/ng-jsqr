import {IController, IPromise} from "angular";
import {IFollowingCategoryService} from "../../../../interfaces/services/following-category-service.interface";
import {IUiService} from "../../../../interfaces/services/ui-service.interface";
import {ICategoryService} from "../../../../interfaces/services/category-service.interface";
import {User} from "../../../../models/entities/user";
import {IProfileNotificationScope} from "./profile-notification.scope";
import {INotificationMessageService} from "../../../../interfaces/services/notification-message-service.interface";
import {SearchResult} from "../../../../models/search-result";
import {NotificationMessage} from "../../../../models/entities/notification-message";

import {cloneDeep} from 'lodash';
import {LoadNotificationMessageViewModel} from "../../../../view-models/notification-message/load-notification-message.view-model";
import {Pagination} from "../../../../models/pagination";
import {PaginationConstant} from "../../../../constants/pagination.constant";

/* @ngInject */
export class ProfileNotificationController implements IController {

    //#region Properties

    //#endregion

    //#region Constructor

    // Initialize controller with injector.
    public constructor(public $scope: IProfileNotificationScope,
                       public $ui: IUiService,
                       public $followingCategory: IFollowingCategoryService,
                       public $notificationMessage: INotificationMessageService,
                       public $category: ICategoryService,
                       public profile: User) {

        // Load notification message initialization.
        let loadNotificationMessagesCondition = new LoadNotificationMessageViewModel();
        loadNotificationMessagesCondition.statuses = null;
        let loadNotificationMessagePagination = new Pagination();
        loadNotificationMessagePagination.page = 1;
        loadNotificationMessagePagination.records = PaginationConstant.notificationMessages;
        loadNotificationMessagesCondition.pagination = loadNotificationMessagePagination;
        this.$scope.loadNotificationMessagesCondition = loadNotificationMessagesCondition;

        let loadNotificationMessageResult = new SearchResult<NotificationMessage>();
        this.$scope.loadNotificationMessagesResult = loadNotificationMessageResult;

        this.$scope.ngOnInit = this._ngOnInit;
        this.$scope.ngOnPageChanged = this._ngOnPageChanged;
    }

    //#endregion

    //#region Methods

    // Called when component is initialized.
    private _ngOnInit = (): void => {
        this._ngOnPageChanged();
    };

    // Called when search result page is changed.
    private _ngOnPageChanged = (): void => {

        // Block app ui.
        this.$ui.blockAppUI();

        let loadNotificationMessageCondition = cloneDeep(this.$scope.loadNotificationMessagesCondition);
        this.$notificationMessage
            .loadNotificationMessages(loadNotificationMessageCondition)
            .then((loadNotificationMessagesResult: SearchResult<NotificationMessage>) => {
                this.$scope.loadNotificationMessagesResult = loadNotificationMessagesResult;
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    //#endregion

}