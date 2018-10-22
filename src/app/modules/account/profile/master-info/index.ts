import {StateProvider} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../../constants/url-state.constant";
import {module} from 'angular';

/* @ngInject */
export class ProfileMasterInfoModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider) {

        $stateProvider
            .state(UrlStateConstant.profileModuleName, {
                url: UrlStateConstant.profileModuleUrl,
                templateProvider: ['$q', ($q) => {
                    // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                    return $q((resolve) => {
                        // lazy load the view
                        require.ensure([], () => {

                            require('./master-info.scss');
                            require('ui-cropper/compile/unminified/ui-cropper.css');
                            resolve(require('./master-info.html'));
                        });
                    });
                }],
                controller: 'profileMasterInfoController',
                resolve: {
                    // Load master layout controller.
                    loadProfileController: ($q, $ocLazyLoad) => {
                        return $q((resolve) => {
                            require.ensure([], () => {

                                require('angular-file-upload');
                                require('ui-cropper');

                                // load only controller module
                                let ngModule = module('account.profile', ['angularFileUpload', 'uiCropper']);

                                const {ProfileMasterInfoController} = require('./master-info.controller.ts');
                                ngModule.controller('profileMasterInfoController', ProfileMasterInfoController);

                                const {ChangePasswordController} = require('./change-password/change-password.controller');
                                ngModule.controller('changePasswordController', ChangePasswordController);

                                const {UserSignatureController} = require('./user-signature/user-signature.controller');
                                ngModule.controller('userSignatureController', UserSignatureController);

                                $ocLazyLoad.load({name: ngModule.name});
                                resolve(ngModule.controller);
                            })
                        });
                    }
                },
                parent: UrlStateConstant.profileMasterLayoutModuleName
            });
    }

    //#endregion

}