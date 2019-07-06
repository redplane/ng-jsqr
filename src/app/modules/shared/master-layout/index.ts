import {StateProvider} from "@uirouter/angularjs";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {module} from 'angular';

/* @ngInject */
export class MasterLayoutModule {

    //#region Constructor

    /*
    * Initialize module with injectors.
    * */
    public constructor($stateProvider: StateProvider){
        // State configuration
        $stateProvider.state(UrlStateConstant.authorizedLayoutModuleName, {
            controller: 'authorizedLayoutController',
            abstract: true,
            templateProvider: ['$q', ($q) => {
                // We have to inject $q service manually due to some reasons that ng-annotate cannot add $q service in production mode.
                return $q((resolve) => {
                    // lazy load the view
                    require.ensure([], () => {
                        require('./master-layout.scss');
                        resolve(require('./master-layout.html'))
                    });
                });
            }],
            resolve: {

                /*
                * Load master-layout controller.
                * */
                loadController: ($q, $ocLazyLoad) => {
                    return $q((resolve) => {
                        require.ensure([], () => {


                            // load only controller module
                            let ngModule = module('shared.master-layout', []);

                            const {MasterLayoutController} = require('./master-layout.controller.ts');
                            ngModule.controller('authorizedLayoutController', MasterLayoutController);
                            $ocLazyLoad.load({name: ngModule.name});
                            resolve(ngModule.controller);
                        })
                    });
                }
            }
        });
    }

    //#endregion
}