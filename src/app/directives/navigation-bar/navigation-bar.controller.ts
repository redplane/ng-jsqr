import {IController} from "angular";
import {INavigationBarScope} from "./navigation-bar.scope";
import {StateService} from "@uirouter/core";
import {UrlStateConstant} from "../../constants/url-state.constant";
import {ProfileStateParam} from "../../models/params/profile.state-param";

/* @ngInject */
export class NavigationBarController implements IController {

    //#region Constructor

    /*
    * Initialize controller with injectors.
    * */
    public constructor(public $scope: INavigationBarScope, public $state: StateService) {

        $scope.ngOnLoginClicked = this._ngOnLoginClicked;
        $scope.ngOnRegisterClicked = this._ngClickRegister;
        $scope.ngOnSignOutClicked = this._ngClickSignOut;
        $scope.ngOnProfileClicked = this._ngClickProfile;
        $scope.ngOnBrandClicked = this._ngOnBrandClicked;
        $scope.ngOnSeeMoreMessageClicked = this._ngOnSeeMoreMessageClicked;
    }

    //#endregion

    //#region Methods

    // Called when login is clicked.
    private _ngOnLoginClicked = (): void => {
        if (!this.$scope.ngClickLogin)
            return;

        this.$scope.ngClickLogin();
    };

    // Called when register is clicked.
    private _ngClickRegister = (): void => {
        if (!this.$scope.ngClickRegister)
            return;

        this.$scope.ngClickRegister();
    };

    // Called when sign out is clicked.
    private _ngClickSignOut = (): void => {
        if (!this.$scope.ngClickSignOut)
            return;

        this.$scope.ngClickSignOut();
    };

    // Called when profile is clicked.
    private _ngClickProfile = (): void => {
        if (!this.$scope.ngClickProfile)
            return;

        this.$scope.ngClickProfile();
    };

    // Called when profile is clicked.
    private _ngOnBrandClicked = (): void => {
        // Redirect user to home page.
        this.$state.go(UrlStateConstant.dashboardModuleName);
    };

    // Called when see more message is clicked.
    private _ngOnSeeMoreMessageClicked = (): void => {

        if (!this.$scope.ngClickSeeMessages)
            return;

        this.$scope.ngClickSeeMessages();
    };

    //#endregion

}