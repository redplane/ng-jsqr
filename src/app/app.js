'use strict';

// Css imports.
require('../../node_modules/bootstrap/dist/css/bootstrap.css');

// Font awesome.
require('../../node_modules/font-awesome/css/font-awesome.css');


require('./styles/app.scss');

// Import jquery lib.
require('jquery');
require('bluebird');
require('bootstrap');


$.ajax({
    url: '/assets/app-settings.json',
    contentType: 'application/json',
    method: 'GET',
    cache: false,
    crossDomain: false,
    success: (loadAppOptionResponse) => {
        require('../../node_modules/angular-toastr/dist/angular-toastr.css');
        require('../../node_modules/angular-block-ui/dist/angular-block-ui.css');


        // Angular plugins declaration.
        const angular = require('angular');
        require('@uirouter/angularjs');
        require('oclazyload');
        require('angular-block-ui');
        require('angular-toastr');
        require('angular-translate');
        require('angular-translate-loader-static-files');
        require('angular-ui-bootstrap');
        require('angular-sanitize');
        require('angular-messages');
        require('angular-local-storage');

        // Bind the app setting to window object.
        window['_ngAppOptions'] = loadAppOptionResponse;

        // Module declaration.
        let ngModule = angular.module('ngApp', ['ui.router', 'blockUI', 'toastr',
            'ui.bootstrap', 'ngMessages', 'oc.lazyLoad',
            'pascalprecht.translate', 'ngSanitize', 'LocalStorageModule']);

        // Import url state constant
        const UrlStateConstant = require('./constants/url-state.constant.ts').UrlStateConstant;

        ngModule
            .config(($urlRouterProvider, $translateProvider, $httpProvider,
                     blockUIConfig) => {

                // API interceptor
                $httpProvider.interceptors.push('apiInterceptor');

                // Url router config.
                $urlRouterProvider.otherwise(UrlStateConstant.dashboardModuleUrl);

                // Translation config.
                $translateProvider.useStaticFilesLoader({
                    prefix: './assets/dictionary/',
                    suffix: '.json'
                });

                // Use sanitize.
                $translateProvider.useSanitizeValueStrategy('sanitize');

                // en-US is default selection.
                $translateProvider.use('en-US');
            });

        // Import configurations.
        require('./configs')(ngModule);

        // Constants import.
        require('./constants')(ngModule);

        // Factories import.
        require('./factories')(ngModule);

        // Services import.
        require('./services')(ngModule);

        // Directive requirements.
        require('./directives')(ngModule);

        // Module requirements.
        const {AppModule} = require('./modules/index.ts');
        new AppModule(ngModule);

        // Manually bootstrap the application.
        angular.bootstrap(document, ['ngApp']);
    }
});




