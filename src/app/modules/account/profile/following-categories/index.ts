import {StateProvider} from "@uirouter/angularjs";
import {IQService, module} from 'angular';
import {UrlStateConstant} from "../../../../constants/url-state.constant";

/* @ngInject */
export class ProfileFollowCategoryModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        $stateProvider
            .state(UrlStateConstant.profileFollowCategoryModuleName, {
                url: UrlStateConstant.profileFollowCategoryModuleUrl,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => {
                            resolve(require('./following-categories.html'));
                        });
                    });
                }],
                controller: 'followingCategoriesController',
                resolve: {
                    // Load following categories controller.
                    loadFollowingCategoriesController: ($q: IQService, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('account.profile.following-categories', []);

                                const {FollowingCategoriesController} = require('./following-categories.controller.ts');
                                ngModule.controller('followingCategoriesController', FollowingCategoriesController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            });
                        });
                    }
                },
                parent: UrlStateConstant.profileMasterLayoutModuleName
            });
    }

    //#endregion

}