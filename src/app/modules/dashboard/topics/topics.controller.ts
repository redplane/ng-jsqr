import {IController, IPromise, IQService} from "angular";
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
import {CategoryGroupDetailResolver} from "../../../models/resolvers/category-group-detail.resolver";
import {TopicSummary} from "../../../models/entities/topic-summary";
import {LoadTopicSummaryViewModel} from "../../../view-models/load-topic-summary.view-model";
import {IFollowingCategoryService} from "../../../interfaces/services/following-category-service.interface";
import {LoadFollowingCategoryViewModel} from "../../../view-models/following-category/load-following-category.view-model";
import {FollowingCategory} from "../../../models/entities/following-category";
import {ItemStatus} from "../../../enums/item-status.enum";
import {IToastrService} from "angular-toastr";

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
                       public $topic: ITopicService, public $user: IUserService, public $followingCategory: IFollowingCategoryService,
                       public $ui: IUiService, public $q: IQService,
                       public $translate: angular.translate.ITranslateService, public toastr: IToastrService,
                       public profile: User,
                       public routeResolver: CategoryGroupDetailResolver) {

        $scope.loadTopicsResult = new SearchResult<Topic>();

        let pagination = new Pagination();
        pagination.page = 1;
        pagination.records = PaginationConstant.topics;
        let loadTopicsCondition = new LoadTopicViewModel();
        loadTopicsCondition.categoryIds = [routeResolver.category.id];
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
        $scope.ngGetTopicFollowersSummary = this._ngGetTopicFollowersSummary;
        $scope.ngGetTopicRepliesSummary = this._ngGetTopicRepliesSummary;

        $scope.ngIsUnfollowCategoryAvailable = this._ngIsUnfollowCategoryAvailable;
        $scope.ngIsFollowCategoryAvailable = this._ngIsFollowCategoryAvailable;
        $scope.ngIsActionPanelAvailable = this._ngIsActionPanelAvailable;
        $scope.ngOnUnfollowCategoryClicked = this._ngOnUnfollowCategoryClicked;
        $scope.ngOnFollowCategoryClicked = this._ngOnFollowCategoryClicked;

        $scope.bIsCategoryFollowed = false;
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

        const loadFollowingCategoryCondition = new LoadFollowingCategoryViewModel();
        loadFollowingCategoryCondition.categoryIds = [this.$scope.category.id];
        loadFollowingCategoryCondition.statuses = [ItemStatus.available];
        loadFollowingCategoryCondition.pagination = new Pagination();
        loadFollowingCategoryCondition.pagination.page = 1;
        loadFollowingCategoryCondition.pagination.records = 1;

        let loadFollowingCategoryPromise = this.$followingCategory
            .loadFollowingCategories(loadFollowingCategoryCondition)
            .then((loadFollowingCategoriesResult: SearchResult<FollowingCategory>) => {
                if (!loadFollowingCategoriesResult || !loadFollowingCategoriesResult.records || !loadFollowingCategoriesResult.records.length){
                    this.$scope.bIsCategoryFollowed = false;
                    return;
                }

                this.$scope.bIsCategoryFollowed = true;
            });

        let loadCategoryTopicsPromise = this._loadTopics();

        this.$q
            .all([loadFollowingCategoryPromise, loadCategoryTopicsPromise])
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    /*
    * Called when add topic button is clicked.
    * */
    private _ngOnAddTopicClicked = (): void => {

        this.$ui.blockAppUI();

        this.$state
            .go(UrlStateConstant.addTopicModuleName, {categoryId: this.$scope.category.id})
            .then(() => {
                this.$ui.unblockAppUI();
            })
            .catch(() => {
                this.$ui.unblockAppUI();
            });
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

        // Topic id to topic summary map.
        let mTopicIdToTopicSummaryMap: {[topicId: number]: TopicSummary} = {};


        // Load topics.
        let oLoadTopicResult = new SearchResult<Topic>();

        return this.$topic
            .loadTopics(conditions)
            .then((loadTopicsResult: SearchResult<Topic>) => {

                // Load topic users
                oLoadTopicResult = loadTopicsResult;

                // Get topics list.
                let topics = loadTopicsResult.records;

                let loadTopicsCreatorsPromise = this._loadTopicsCreators(topics)
                    .then((users: User[]) => {
                        for (let user of users)
                            mIdToUserMap[user.id] = user;
                    });

                let loadTopicsSummariesPromise = this._loadTopicsSummaries(topics)
                    .then((topicSummaries: TopicSummary[]) => {
                        for (let topicSummary of topicSummaries){
                            mTopicIdToTopicSummaryMap[topicSummary.topicId] = topicSummary;
                        }
                    });

                return this.$q
                    .all([loadTopicsCreatorsPromise, loadTopicsSummariesPromise]);
            })
            .then(() => {
                this.$scope.mIdToUser = mIdToUserMap;
                this.$scope.loadTopicsResult = oLoadTopicResult;
                this.$scope.mTopicIdToTopicSummary = mTopicIdToTopicSummaryMap;
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

    /*
    * Load topics summaries using specific condtions.
    * */
    private _loadTopicsSummaries(topics: Array<Topic>): IPromise<TopicSummary[]> {
        let condition = new LoadTopicSummaryViewModel();
        condition.topicIds = topics.map(topic => topic.id);
        condition.pagination = null;

        return this.$topic
            .loadTopicSummaries(condition)
            .then((loadTopicSummariesResult: SearchResult<TopicSummary>) => {
                return loadTopicSummariesResult.records;
            });
    };

    /*
    * Load topic replies summary.
    * */
    private _ngGetTopicRepliesSummary = (topicId: number): number => {
        let mTopicIdToTopicSummary = this.$scope.mTopicIdToTopicSummary;
        if (!mTopicIdToTopicSummary || !mTopicIdToTopicSummary[topicId])
            return 0;

        return mTopicIdToTopicSummary[topicId].topicReply || 0;
    };

    /*
    * Load topic followers summary.
    * */
    private _ngGetTopicFollowersSummary = (topicId: number): number => {
        let mTopicIdToTopicSummary = this.$scope.mTopicIdToTopicSummary;
        if (!mTopicIdToTopicSummary || !mTopicIdToTopicSummary[topicId])
            return 0;

        return mTopicIdToTopicSummary[topicId].totalFollower || 0;
    };

    // Check whether current user is authenticated or not.
    private _ngIsUserAuthenticated = (): boolean => {
        if (!this.profile)
            return false;

        return true;
    };

    // Whether unfollow category is available or not.
    private _ngIsUnfollowCategoryAvailable = (): boolean => {
        if (!this._ngIsUserAuthenticated())
            return false;

        if (!this.$scope.bIsCategoryFollowed)
            return false;

        return true;
    };

    // Whether follow category is available or not.
    private _ngIsFollowCategoryAvailable = (): boolean => {
        if (!this._ngIsUserAuthenticated())
            return false;

        if (this.$scope.bIsCategoryFollowed)
            return false;

        return true;
    };

    // Whether action panel is available or not.
    private _ngIsActionPanelAvailable = (): boolean => {
        if (!this._ngIsUserAuthenticated())
            return false;

        return true;
    };

    // Called when on follow category is clicked.
    private _ngOnFollowCategoryClicked = (categoryId: number): void => {
        this.$ui.blockAppUI();

        this.$followingCategory
            .followCategory(categoryId)
            .then(() => {
                let message = this.$translate.instant('MSG_YOU_HAVE_FOLLOWED_CATEGORY', this.$scope.category);
                this.toastr.success(message);
                this.$scope.bIsCategoryFollowed = true;
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            })
    };

    // Called when unfollow category is clicked.
    private _ngOnUnfollowCategoryClicked = (categoryId: number): void => {
        this.$ui.unblockAppUI();
        this.$followingCategory
            .stopFollowingCategory(categoryId)
            .then(() => {
                let message = this.$translate.instant('MSG_YOU_HAVE_UNSUBSCRIBED_CATEGORY', this.$scope.category);
                this.toastr.success(message);
                this.$scope.bIsCategoryFollowed = false;
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            })
    };

    //#endregion
}