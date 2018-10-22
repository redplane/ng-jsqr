import {IAngularEvent, IController} from "angular";
import {IUserService} from "../../../../../interfaces/services/user-service.interface";
import {IUiService} from "../../../../../interfaces/services/ui-service.interface";
import {IUserSignatureScope} from "./user-signature.scope";
import {AddUserSignatureViewModel} from "../../../../../view-models/users/add-user-signature.view-model";
import {TabNameConstant} from "../../../../../constants/tab-name.constant";
import {AddUserSignatureModalResolver} from "../../../../../models/resolvers/add-user-signature-modal.resolver";

/* @ngInject */
export class UserSignatureController implements IController {

    //#region Properties

    //#endregion

    //#region Constructor

    public constructor(public $scope: IUserSignatureScope,
                       public $ui: IUiService,
                       public $user: IUserService,
                       public modalResolver: AddUserSignatureModalResolver){
        let user = this.modalResolver.user;
        $scope.addUserSignatureModel = new AddUserSignatureViewModel();
        $scope.addUserSignatureModel.signature = user.signature;
        $scope.addUserSignatureModel.userId = user.id;

        $scope.tabNameConstant = TabNameConstant;
        $scope.signatureActiveTab = TabNameConstant.signatureContentTabName;

        $scope.ngOnSignatureUpdateClicked = this._ngOnSignatureUpdateClicked;
        $scope.ngOnModalCancelClicked = this._ngOnModalCancelClicked;
    }

    //#endregion

    //#region Methods

    // Called when signature update is clicked.
    private _ngOnSignatureUpdateClicked = ($event: IAngularEvent): void => {

        // Prevent default behavior.
        if ($event)
            $event.preventDefault();

        const addUserSignatureForm = this.$scope.addUserSignatureForm;
        if (!addUserSignatureForm || addUserSignatureForm.$invalid)
            return;

        // Block app ui.
        this.$ui.blockAppUI();

        let addUserSignatureModel = this.$scope.addUserSignatureModel;
        this.$user.addUserSignature(addUserSignatureModel)
            .then(() => {
                this.$scope.$close(addUserSignatureModel.signature);
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    // Called when signature modal cancel is clicked.
    private _ngOnModalCancelClicked = (): void => {
        this.$scope.$dismiss('SIGNATURE_EDITOR_MANUALLY_CLOSED');
    };

    //#endregion
}