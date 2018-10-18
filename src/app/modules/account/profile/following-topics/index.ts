import {StateProvider} from "@uirouter/angularjs";
import {IPromise, IQService, module} from 'angular';
import {Ng1ViewDeclaration} from "@uirouter/angularjs/lib/interface";
import {UrlStateConstant} from "../../../../constants/url-state.constant";

/* @ngInject */
export class ProfileFollowTopicModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        $stateProvider
            .state(UrlStateConstant.profileFollowTopicModuleName, {
                url: UrlStateConstant.profileFollowTopicModuleUrl,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => {
                            resolve(require('./following-topics.html'));
                        });
                    });
                }],
                controller: 'followingTopicsController',
                resolve: {

                    // Load following topics controller.
                    loadFollowingTopicsController: ($q: IQService, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('account.profile.following-topics', []);

                                const {PersonalFollowingTopicsController} = require('./following-topics.controller.ts');
                                ngModule.controller('followingTopicsController', PersonalFollowingTopicsController);
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