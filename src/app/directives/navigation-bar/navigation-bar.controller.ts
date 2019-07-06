import {IController} from "angular";
import {INavigationBarScope} from "./navigation-bar.scope";
import {StateService} from "@uirouter/core";

/* @ngInject */
export class NavigationBarController implements IController {

    //#region Constructor

    /*
    * Initialize controller with injectors.
    * */
    public constructor(public $scope: INavigationBarScope, public $state: StateService) {
    }

    //#endregion

}