import {ICompileService, IController, IQService} from "angular";

/* @ngInject */
export class AppFooterController implements IController {

    //#region Properties



    //#endregion

    //#region Constructor

    // Initialize controller with injector.
    public constructor(public $q: IQService, public $compile: ICompileService) {


    }

    //#endregion

}