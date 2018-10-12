import {StateProvider} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {IPromise, IQService, module} from 'angular';
import {User} from "../../../models/entities/user";
import {StateParams, StateService} from '@uirouter/angularjs';
import {LoadUserViewModel} from "../../../view-models/users/load-user.view-model";
import {Pagination} from "../../../models/pagination";
import {IUserService} from "../../../interfaces/services/user-service.interface";
import {SearchResult} from "../../../models/search-result";
import {Ng1ViewDeclaration} from "@uirouter/angularjs/lib/interface";
import {PersonalFollowingTopicsController} from "./following-topics/following-topics.controller";
import {FollowingCategoriesController} from "./following-categories/following-categories.controller";
import {ProfileResolver} from "./profile.resolver";

/* @ngInject */
export class ProfileModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        //#region Views declaration

        let views: { [name: string]: Ng1ViewDeclaration } = {};

        // Master layout view.
        views[''] = {
            templateProvider: ['$q', ($q) => {
                // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                return $q((resolve) => {
                    // lazy load the view
                    require.ensure([], () => {

                        require('./profile.scss');
                        require('ui-cropper/compile/unminified/ui-cropper.css');
                        resolve(require('./profile.html'));
                    });
                });
            }],
            controller: 'profileController'
        };

        // Created topics sub-view
        views[`${UrlStateConstant.profileTopicsModuleName}@${UrlStateConstant.profileModuleName}`] = {
            templateProvider: ['$q', ($q) => {
                // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                return $q((resolve) => {
                    // lazy load the view
                    require.ensure([], () => {
                        resolve(require('./topics/topics.html'));
                    });
                });
            }],
            controller: 'profileTopicsController'
        };

        // Following topics.
        views[`${UrlStateConstant.followingTopicsModuleName}@${UrlStateConstant.profileModuleName}`] = {
            templateProvider: ['$q', ($q) => {
                // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                return $q((resolve) => {
                    // lazy load the view
                    require.ensure([], () => {
                        resolve(require('./following-topics/following-topics.html'));
                    });
                });
            }],
            controller: 'followingTopicsController'
        };

        // Following categories
        views[`${UrlStateConstant.followingCategoriesModuleName}@${UrlStateConstant.profileModuleName}`] = {
            templateProvider: ['$q', ($q) => {
                // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                return $q((resolve) => {
                    // lazy load the view
                    require.ensure([], () => {
                        resolve(require('./following-categories/following-categories.html'));
                    });
                });
            }],
            controller: 'followingCategoriesController'
        };

        //#endregion

        $stateProvider
            .state(UrlStateConstant.profileModuleName, {
                url: UrlStateConstant.profileModuleUrl,
                views: views,
                resolve: {

                    // Load master layout controller.
                    loadMasterLayoutController: ($q, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {

                                // Import module.
                                require('angular-file-upload');
                                require('ui-cropper');

                                // load only controller module
                                let ngModule = module('account.profile', ['angularFileUpload', 'uiCropper']);

                                const {ProfileController} = require('./profile.controller.ts');
                                ngModule.controller('profileController', ProfileController);

                                const {ChangePasswordController} = require('./change-password/change-password.controller.ts');
                                ngModule.controller('changePasswordController', ChangePasswordController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            })
                        });
                    },

                    // Load personal topics controller.
                    loadPersonalTopicsController: ($q, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('account.profile.topics', []);

                                const {PersonalTopicsController} = require('./topics/topics.controller.ts');
                                ngModule.controller('profileTopicsController', PersonalTopicsController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            });
                        });
                    },

                    // Load following topics controller.
                    loadFollowingTopicsController: ($q: IQService, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('account.profile.following-topics', []);

                                const {PersonalFollowingTopicsController} = require('./following-topics/following-topics.controller.ts');
                                ngModule.controller('followingTopicsController', PersonalFollowingTopicsController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            });
                        });
                    },

                    // Load following categories controller.
                    loadFollowingCategoriesController: ($q: IQService, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('account.profile.following-categories', []);

                                const {FollowingCategoriesController} = require('./following-categories/following-categories.controller.ts');
                                ngModule.controller('followingCategoriesController', FollowingCategoriesController);
                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            });
                        });
                    },

                    /*
                    * Load profile by using id.
                    * */
                    routeResolver: ($stateParams: StateParams, $state: StateService, $user: IUserService): ProfileResolver | IPromise<ProfileResolver> => {

                        // Get profile id.
                        let profileId = parseInt($stateParams.profileId);

                        // Profile is not valid.
                        if (!profileId)
                            profileId = 0;

                        // Initialize route resolver.
                        let routeResolver = new ProfileResolver();

                        // Get current user profile.
                        return $user
                            .loadUserProfile(profileId)
                            .then((user: User) => {
                                routeResolver.user = user;
                                return routeResolver;
                            })
                            .catch(() => {
                                $state.go(UrlStateConstant.dashboardModuleName);
                                throw 'Cannot find user profile';
                            });
                    }
                },
                parent: UrlStateConstant.authorizedLayoutModuleName
            });
    }

    //#endregion

}