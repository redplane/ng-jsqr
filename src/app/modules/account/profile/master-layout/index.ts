/* @ngInject */
import {Ng1ViewDeclaration, StateProvider, StateService} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../../constants/url-state.constant";
import {IPromise, module} from 'angular';
import {ProfileStateParam} from "../../../../models/params/profile.state-param";
import {IUserService} from "../../../../interfaces/services/user-service.interface";
import {User} from "../../../../models/entities/user";
import {ProfileMasterInfoResolver} from "../../../../models/resolvers/profile-master-info.resolver";

export class ProfileMasterLayoutModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        $stateProvider
            .state(UrlStateConstant.profileMasterLayoutModuleName, {
                abstract: true,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => {
                            resolve(require('./master-layout.html'));
                        });
                    });
                }],
                controller: 'profileMasterLayoutController',
                resolve: {

                    // Load master layout controller.
                    loadMasterLayoutController: ($q, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {

                                // load only controller module
                                let ngModule = module('profile.master-layout', []);

                                const {ProfileMasterLayoutController} = require('./master-layout.controller');
                                ngModule.controller('profileMasterLayoutController', ProfileMasterLayoutController);

                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            })
                        });
                    },

                    /*
                    * Load profile by using id.
                    * */
                    routeResolver: ($stateParams: ProfileStateParam, $state: StateService, $user: IUserService): ProfileMasterInfoResolver | IPromise<ProfileMasterInfoResolver> => {

                        // Get profile id.
                        let profileId = $stateParams.profileId;

                        // Profile is not valid.
                        if (!profileId)
                            profileId = 0;

                        // Initialize route resolver.
                        let routeResolver = new ProfileMasterInfoResolver();

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