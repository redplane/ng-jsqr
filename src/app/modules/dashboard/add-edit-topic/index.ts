import {StateProvider, StateService} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {IPromise, module} from 'angular';
import {IUserService} from "../../../interfaces/services/user-service.interface";
import {User} from "../../../models/entities/user";
import {StateParams} from '@uirouter/angularjs'
import {ITopicService} from "../../../interfaces/services/topic-service.interface";
import {LoadTopicViewModel} from "../../../view-models/load-topic.view-model";
import {Pagination} from "../../../models/pagination";
import {SearchResult} from "../../../models/search-result";
import {Topic} from "../../../models/entities/topic";
import {AddEditTopicResolver} from "./add-edit-topic.resolver";
import {ICategoryService} from "../../../interfaces/services/category-service.interface";
import {LoadCategoryViewModel} from "../../../view-models/load-category.view-model";
import {Category} from "../../../models/entities/category";

/* @ngInject */
export class AddEditTopicModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        //#region Add topic

        $stateProvider
            .state(UrlStateConstant.addTopicModuleName, {
                url: UrlStateConstant.addTopicModuleUrl,
                controller: 'addEditTopicController',
                parent: UrlStateConstant.authorizedLayoutModuleName,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => resolve(require('./add-edit-topic.html')));
                    });
                }],
                resolve: {
                    /*
                    * Load login controller.
                    * */
                    loadController: ($q, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('main.add-topic', []);
                                const {AddEditTopicController} = require('./add-edit-topic.controller.ts');
                                ngModule.controller('addEditTopicController', AddEditTopicController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            })
                        });
                    },

                    routeResolver: ($stateParams: StateParams,
                                    $state: StateService, $category: ICategoryService): IPromise<AddEditTopicResolver> | null => {

                        // No category is found.
                        if (!$stateParams['categoryId']) {
                            $state.go(UrlStateConstant.dashboardModuleName);
                            throw 'No category is found to contain topic';
                        }

                        let iCategoryId = parseInt($stateParams['categoryId']);
                        if (!iCategoryId) {
                            $state.go(UrlStateConstant.dashboardModuleName);
                            throw 'No category is found to contain topic';
                        }

                        let resolver = new AddEditTopicResolver();
                        let loadCategoryCondition = new LoadCategoryViewModel();
                        loadCategoryCondition.ids = [iCategoryId];
                        loadCategoryCondition.pagination = new Pagination();
                        loadCategoryCondition.pagination.page = 1;
                        loadCategoryCondition.pagination.records = 1;

                        return $category.loadCategories(loadCategoryCondition)
                            .then((loadCategoriesResult: SearchResult<Category>) => {
                                if (!loadCategoriesResult || !loadCategoriesResult.records)
                                    throw 'No category is found to contain topic';

                                resolver.category = loadCategoriesResult.records[0];
                                return resolver;
                            })

                    }
                }
            });

        //#endregion

        //#region Edit topic

        $stateProvider
            .state(UrlStateConstant.editTopicModuleName, {
                url: UrlStateConstant.editTopicModuleUrl,
                controller: 'addEditTopicController',
                parent: UrlStateConstant.authorizedLayoutModuleName,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => resolve(require('./add-edit-topic.html')));
                    });
                }],
                resolve: {
                    /*
                    * Load login controller.
                    * */
                    loadController: ($q, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('main.edit-topic', []);
                                const {AddEditTopicController} = require('./add-edit-topic.controller.ts');
                                ngModule.controller('addEditTopicController', AddEditTopicController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            })
                        });
                    },

                    /*
                    * Topic information.
                    * */
                    routeResolver: ($stateParams: StateParams,
                                    $user: IUserService,
                                    $topic: ITopicService, $category: ICategoryService):  IPromise<AddEditTopicResolver> | null => {

                        let topicId = parseInt($stateParams.topicId);

                        // Build load topic condition.
                        let loadTopicsCondition = new LoadTopicViewModel();
                        let pagination = new Pagination();
                        pagination.page = 1;
                        pagination.records = 1;
                        loadTopicsCondition.ids = [topicId];
                        loadTopicsCondition.pagination = pagination;

                        // Initialize resolver.
                        let addEditTopicResolver = new AddEditTopicResolver();

                        return $topic
                            .loadTopics(loadTopicsCondition)
                            .then((loadTopicsResult: SearchResult<Topic>) => {
                                let topics = loadTopicsResult.records;
                                if (!topics)
                                    throw 'No topic has been found';

                                const topic = topics[0];
                                addEditTopicResolver.topic = topic;

                                return $category
                                    .loadCategoryUsingId(topic.id)
                            })
                            .then((category: Category) => {
                                addEditTopicResolver.category = category;
                                return addEditTopicResolver;
                            })
                            .catch(() => {
                                return null;
                            });
                    }
                }
            });

        //#endregion

    }

    //#endregion

}