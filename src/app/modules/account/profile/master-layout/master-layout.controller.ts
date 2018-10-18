import {IController, IPromise, IQService} from "angular";
import {IUiService} from "../../../../interfaces/services/ui-service.interface";
import {ITopicService} from "../../../../interfaces/services/topic-service.interface";
import {ICategoryService} from "../../../../interfaces/services/category-service.interface";
import {IUserService} from "../../../../interfaces/services/user-service.interface";
import {StateService} from "@uirouter/core";
import {IProfileMasterLayoutScope} from "./master-layout.scope";
import {UrlStateConstant} from "../../../../constants/url-state.constant";
import {ProfileMasterInfoResolver} from "../../../../models/resolvers/profile-master-info.resolver";

/* @ngInject */
export class ProfileMasterLayoutController implements IController {

    //#region Properties

    //#endregion

    //#region Constructors

    // Initialize controller with injectors.
    public constructor(public $ui: IUiService,
                       public $topic: ITopicService, public $category: ICategoryService, public $user: IUserService,
                       public $q: IQService, public $state: StateService,
                       public $scope: IProfileMasterLayoutScope, public routeResolver: ProfileMasterInfoResolver) {

        this.$scope.userId = routeResolver.user.id;
        this.$scope.urlStateConstant = UrlStateConstant;

        // Methods binding
        this.$scope.ngIsTabActive = this._ngIsTabActive;
        this.$scope.ngSelectTab = this._ngSelectTab;
    }

    //#endregion

    //#region Methods

    /*
    * Check whether tab is selected or not.
    * */
    private _ngIsTabActive = (tabName: string): boolean => {
        // let activeTab = this.$scope.activeTab;
        // return activeTab === tabName;
        return true;
    };

    /*
    * Select tab using its name.
    * */
    private _ngSelectTab = (tabName: string): void => {
        // this.$scope.activeTab = tabName;
    };


    //#endregion
}