import {StateProvider} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../../constants/url-state.constant";
import {IQService, module} from 'angular';

/* @ngInject */
export class ProfileNotificationModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        $stateProvider
            .state(UrlStateConstant.profileNotificationsModuleName, {
                url: UrlStateConstant.profileNotificationModuleUrl,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => {
                            resolve(require('./profile-notification.html'));
                        });
                    });
                }],
                controller: 'profileNotificationsController',
                resolve: {
                    // Load master layout controller.
                    loadProfileNotificationMessageController: ($q: IQService, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {
                                // load only controller module
                                let ngModule = module('account.profile.notification-message', []);

                                const {ProfileNotificationController} = require('./profile-notification.controller');
                                ngModule.controller('profileNotificationsController', ProfileNotificationController);
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