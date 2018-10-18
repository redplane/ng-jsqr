import {IScope} from "angular";
import {UrlStateConstant} from "../../../../constants/url-state.constant";

export interface IProfileMasterLayoutScope extends IScope {

    //#region Properties

    userId: number;

    urlStateConstant: UrlStateConstant;

    //#endregion

    //#region Methods

    // Check whether the tab is selected or not.
    ngIsTabActive: (tabName: string) => boolean;

    // Select a tab using its name.
    ngSelectTab: (tabName: string) => void;

    //#endregion
}