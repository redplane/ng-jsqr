import {IController, IPromise} from "angular";
import {IUiService} from "../../../interfaces/services/ui-service.interface";
import {Topic} from "../../../models/entities/topic";
import {SearchResult} from "../../../models/search-result";
import {StateService} from '@uirouter/angularjs';
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {ITopicService} from "../../../interfaces/services/topic-service.interface";
import {LoadTopicViewModel} from "../../../view-models/load-topic.view-model";

import {cloneDeep} from 'lodash';
import {ITopicsScope} from "./topics.scope";
import {User} from "../../../models/entities/user";
import {LoadUserViewModel} from "../../../view-models/users/load-user.view-model";
import {IUserService} from "../../../interfaces/services/user-service.interface";
import {Pagination} from "../../../models/pagination";
import {PaginationConstant} from "../../../constants/pagination.constant";
import {ICategoryService} from "../../../interfaces/services/category-service.interface";
import {CategoryGroupDetailResolver} from "../../../models/resolvers/category-group-detail.resolver";

/* @ngInject */
export class TopicsController implements IController {

    //#region Properties

    //#endregion

    //#region Constructor

    /*
    * Initialize controller with injectors.
    * */
    public constructor(public $scope: ITopicsScope,
                       public $state: StateService,
                       public $topic: ITopicService, public $user: IUserService,
                       public $ui: IUiService,
                       public routeResolver: CategoryGroupDetailResolver) {

        $scope.loadTopicsResult = new SearchResult<Topic>();

        let pagination = new Pagination();
        pagination.page = 1;
        pagination.records = PaginationConstant.topics;
        let loadTopicsCondition = new LoadTopicViewModel();
        loadTopicsCondition.pagination = pagination;
        $scope.loadTopicsCondition = loadTopicsCondition;

        // Properties binding.
        $scope.categoryGroup = routeResolver.categoryGroup;
        $scope.category = routeResolver.category;

        // Methods binding.
        $scope.ngOnInit = this._ngOnInit;
        $scope.ngOnAddTopicClicked = this._ngOnAddTopicClicked;
        $scope.ngOnTopicTitleClicked = this._ngOnTopicTitleClicked;
        $scope.ngOnTopicsPageChanged = this._ngOnTopicsPageChanged;
        $scope.ngOnEditTopicClicked = this._ngOnEditTopicClicked;
        $scope.ngOnProfileClicked = this._ngOnProfileIsClicked;
        $scope.ngOnHomeClicked = this._ngOnHomeClicked;
    }

    //#endregion

    //#region Methods

    /*
    * Called when component is initialized.
    * */
    private _ngOnInit = (): void => {

        // Block app UI.
        this.$ui.blockAppUI();

        // Reset pagination.
        this.$scope.loadTopicsCondition.pagination.page = 1;

        this._loadTopics()
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    /*
    * Called when add topic button is clicked.
    * */
    private _ngOnAddTopicClicked = (): void => {
        this.$state.go(UrlStateConstant.addTopicModuleName, {categoryId: this.$scope.category.id});
    };

    /*
    * Called when topic title is clicked.
    * */
    private _ngOnTopicTitleClicked = (id: number): void => {
        this.$state.go(UrlStateConstant.topicModuleName, {topicId: id});
    };

    /*
    * Called when topics page is changed.
    * */
    private _ngOnTopicsPageChanged = () => {
        // Block ui.
        this.$ui.blockAppUI();

        // Load topics
        this._loadTopics()
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    // Called when edit topic is clicked.
    private _ngOnEditTopicClicked = (topicId: number) => {
        this.$state.go(UrlStateConstant.editTopicModuleName, {topicId: topicId});
    };

    // Called when a profile is clicked.
    private _ngOnProfileIsClicked = (profileId: number) => {
        // Go to profile page.
        this.$state.go(UrlStateConstant.profileModuleName, {profileId: profileId});
    };

    /*
    * Called when home is clicked.
    * */
    private _ngOnHomeClicked = () => {

        // Block UI.
        this.$ui.blockAppUI();

        this.$state.go(UrlStateConstant.dashboardModuleName)
            .then(() => {
                this.$ui.unblockAppUI();
            })
            .catch(() => {
                this.$ui.unblockAppUI();
            });
    };

    /*
    * Load topics by using pre-defined conditions.
    * */
    private _loadTopics(): IPromise<void> {

        // Copy the topics load condition.
        let conditions = cloneDeep(this.$scope.loadTopicsCondition);

        // Id to user map.
        let mIdToUserMap: { [id: number]: User } = {};

        // Load topics.
        let oLoadTopicResult = new SearchResult<Topic>();

        return this.$topic
            .loadTopics(conditions)
            .then((loadTopicsResult: SearchResult<Topic>) => {

                // Load topic users
                oLoadTopicResult = loadTopicsResult;

                // Get topics list.
                let topics = loadTopicsResult.records;

                //#region Load user who

                this._loadTopicsCreators(topics)
                    .then((users: User[]) => {
                        for (let user of users)
                            mIdToUserMap[user.id] = user;
                    });

                //#endregion
            })
            .then(() => {
                this.$scope.mIdToUser = mIdToUserMap;
                this.$scope.loadTopicsResult = oLoadTopicResult;
            });
    }

    /*
    * Load topics creators using specific conditions.
    * */
    private _loadTopicsCreators(topics: Array<Topic>): IPromise<User[]> {
        let conditions = new LoadUserViewModel();
        conditions.ids = topics.map((topic) => topic.ownerId);

        let loadUserPagination = new Pagination();
        loadUserPagination.records = PaginationConstant.maxRecords;
        loadUserPagination.page = 1;
        conditions.pagination = loadUserPagination;

        return this.$user
            .loadUsers(conditions)
            .then((loadUsersResult: SearchResult<User>) => {
                return loadUsersResult.records;
            });
    };


    //#endregion
}