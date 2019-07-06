import {IModule} from 'angular';

/* @ngInject */
export class SharedModule {

    //#region Constructor

    public constructor(ngModule: IModule) {
        const {MasterLayoutModule} = require('./master-layout');
        ngModule.config(($stateProvider) => new MasterLayoutModule($stateProvider));
    }

    //#endregion

}