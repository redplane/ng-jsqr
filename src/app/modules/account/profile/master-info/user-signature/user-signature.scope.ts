import {IAngularEvent, IFormController, IScope} from "angular";
import {IModalScope} from "angular-ui-bootstrap";
import {AddUserSignatureViewModel} from "../../../../../view-models/users/add-user-signature.view-model";
import {TabNameConstant} from "../../../../../constants/tab-name.constant";

export interface IUserSignatureScope extends IScope, IModalScope {

    //#region Properties

    readonly addUserSignatureForm: IFormController;

    addUserSignatureModel: AddUserSignatureViewModel;

    tabNameConstant: TabNameConstant;

    signatureActiveTab: string;
    
    //#endregion

    //#region Methods


    // Called when modal cancel is clicked.
    ngOnModalCancelClicked: () => void;

    // Called when modal ok is clicked.
    ngOnSignatureUpdateClicked: ($event: IAngularEvent) => void;

    //#endregion
}