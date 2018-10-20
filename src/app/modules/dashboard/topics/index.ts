import {StateProvider, StateService} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {IPromise, module} from 'angular';
import {ICategoryGroupService} from "../../../interfaces/services/category-group-service.interface";
import {LoadCategoryGroupViewModel} from "../../../view-models/load-category-group.view-model";
import {Pagination} from "../../../models/pagination";
import {SearchResult} from "../../../models/search-result";
import {CategoryGroup} from "../../../models/entities/category-group";
import {CategoryGroupDetailResolver} from "../../../models/resolvers/category-group-detail.resolver";
import {LoadCategoryViewModel} from "../../../view-models/load-category.view-model";
import {ICategoryService} from "../../../interfaces/services/category-service.interface";
import {Category} from "../../../models/entities/category";
import {CategoryDetailStateParam} from "../../../models/params/category-detail.state-param";

/* @ngInject */
export class TopicsModule {

    //region Constructors

    public constructor($stateProvider: StateProvider) {

        $stateProvider.state(UrlStateConstant.categoryDetailModuleName, {
            url: UrlStateConstant.categoryDetailModuleUrl,
            controller: 'topicsController',
            parent: UrlStateConstant.authorizedLayoutModuleName,
            templateProvider: ['$q', ($q) => {
                // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                return $q((resolve) => {
                    // lazy load the view
                    require.ensure([], () => {
                        require('./topics.scss');
                        resolve(require('./topics.html'));
                    });
                });
            }],
            resolve: {

                /*
                * Resolve category group information.
                * */
                routeResolver: ($state: StateService,
                                $stateParams: CategoryDetailStateParam,
                                $categoryGroup: ICategoryGroupService, $category: ICategoryService): IPromise<CategoryGroupDetailResolver> => {

                    // Initialize resolver.
                    let categoryGroupDetailResolver = new CategoryGroupDetailResolver();

                    // Get category group information.
                    let categoryId = $stateParams.categoryId;
                    if (!categoryId)
                        throw 'No topic has been specified';

                    //#region Load category group


                    //#endregion

                    return $category
                        .loadCategoryUsingId(categoryId)

                        //#region Load category

                        .then((category: Category) => {

                            let loadCategoryGroupsCondition = new LoadCategoryGroupViewModel();
                            loadCategoryGroupsCondition.ids = [category.categoryGroupId];
                            loadCategoryGroupsCondition.pagination = new Pagination();
                            loadCategoryGroupsCondition.pagination.page = 1;
                            loadCategoryGroupsCondition.pagination.records = 1;

                            // Update resolver.
                            categoryGroupDetailResolver.category = category;

                            return $categoryGroup
                                .loadCategoryGroups(loadCategoryGroupsCondition)

                        })

                        //#endregion

                        //#region Load category group

                        .then((loadCategoryGroupsResult: SearchResult<CategoryGroup>) => {
                            if (!loadCategoryGroupsResult)
                                throw 'No category group is found';

                            let categoryGroups = loadCategoryGroupsResult.records;
                            if (!categoryGroups || !categoryGroups[0])
                                throw 'No category group is found';

                            categoryGroupDetailResolver.categoryGroup = categoryGroups[0];
                            return categoryGroupDetailResolver;

                        })

                        //#endregion

                        .catch((error) => {
                            $state.go(UrlStateConstant.dashboardModuleName);
                            throw error;
                        });

                },

                /*
                * Load login controller.
                * */
                loadDashboardController: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
                    return $q((resolve) => {
                        require.ensure([], () => {
                            // load only controller module
                            let ngModule = module('main.topics', []);
                            const {TopicsController} = require('.//topics.controller');
                            ngModule.controller('topicsController', TopicsController);
                            $ocLazyLoad.load({name: ngModule.name});
                            resolve(ngModule.controller);
                        })
                    });
                }]
            }
        });
    }

    //#endregion

}