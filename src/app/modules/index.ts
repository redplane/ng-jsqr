import {IModule} from "angular";

export class AppModule {

    //#region Constructor

    public constructor(ngModule: IModule){
        const {SharedModule} = require('./shared');
        new SharedModule(ngModule);
    }

    //#endregion
}