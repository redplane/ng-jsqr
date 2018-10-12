import {StateProvider} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {IPromise, IQService, module} from 'angular';
import {ITopicService} from "../../../interfaces/services/topic-service.interface";
import {StateService} from '@uirouter/core';
import {LoadTopicViewModel} from "../../../view-models/load-topic.view-model";
import {Pagination} from "../../../models/pagination";
import {SearchResult} from "../../../models/search-result";
import {Topic} from "../../../models/entities/topic";
import {TopicResolver} from "./topic.resolver";
import {ICategoryService} from "../../../interfaces/services/category-service.interface";
import {LoadCategoryViewModel} from "../../../view-models/load-category.view-model";
import {Category} from "../../../models/entities/category";

/* @ngInject */
export class TopicModule {

    //#region Constructor

    /*
    * Initialize module with settings.
    * */
    public constructor(public $stateProvider: StateProvider) {
        $stateProvider
            .state(UrlStateConstant.topicModuleName, {
                url: UrlStateConstant.topicModuleUrl,
                controller: 'topicController',
                parent: UrlStateConstant.authorizedLayoutModuleName,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => {
                            require('./topic.scss');
                            resolve(require('./topic.html'));
                        });
                    });
                }],
                resolve: {
                    /*
                    * Load login controller.
                    * */
                    loadDashboardController: ($q: IQService, $ocLazyLoad: any) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('main.topic', []);
                                const {TopicController} = require('./topic.controller');
                                ngModule.controller('topicController', TopicController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            })
                        });
                    },

                    topicDetailResolver: ($topic: ITopicService,
                                          $state: StateService,
                                          $category: ICategoryService,
                                          $stateParams: Map<string, object>): IPromise<TopicResolver> => {

                        //#region Parameters analyze

                        // Get topic id.
                        let topicId: number = parseInt($stateParams['topicId']);
                        if (!topicId) {
                            $state.go(UrlStateConstant.dashboardModuleName);
                            throw 'No topic has been specified';
                        }

                        //#endregion

                        //#region Load topic

                        let loadTopicsCondition = new LoadTopicViewModel();
                        let pagination = new Pagination();
                        pagination.records = 1;
                        pagination.page = 1;

                        loadTopicsCondition.ids = [topicId];
                        loadTopicsCondition.pagination = pagination;

                        // Initialize topic resolver.
                        let topicResolver = new TopicResolver();

                        return $topic
                            .loadTopics(loadTopicsCondition)
                            .then((loadTopicsResult: SearchResult<Topic>) => {
                                let topics = loadTopicsResult.records;
                                if (!topics || !topics.length)
                                    throw 'No topic has been found';

                                const topic = topics[0];
                                topicResolver.topic = topics[0];

                                //#region Load categories

                                let loadCategoryCondition = new LoadCategoryViewModel();
                                loadCategoryCondition.ids = [topic.categoryId];
                                loadCategoryCondition.pagination = new Pagination();
                                loadCategoryCondition.pagination.page = 1;
                                loadCategoryCondition.pagination.records = 1;

                                return $category
                                    .loadCategories(loadCategoryCondition);

                                //#endregion
                            })
                            .then((loadCategoryResult: SearchResult<Category>) => {
                                if (!loadCategoryResult || !loadCategoryResult.records)
                                    throw 'No category is found';

                                const category = loadCategoryResult.records[0];
                                topicResolver.category = category;
                                return topicResolver;
                            })
                            .catch(() => {
                                $state.go(UrlStateConstant.dashboardModuleName);
                                throw 'Cannot resolve topic | category';
                            });

                        //#endregion
                    }
                }
            });
    }

    //#endregion

}