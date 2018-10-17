import {IAngularEvent, IController} from "angular";
import {User} from "../../../../models/entities/user";
import {IProfileGeneralInfoScope} from "./general-info.scope";
import {IUserService} from "../../../../interfaces/services/user-service.interface";
import {IModalInstanceService, IModalService, IModalSettings} from "angular-ui-bootstrap";
import {FileUploaderFactory} from 'angular-file-upload';
import {IFileService} from "../../../../interfaces/services/file-service.interface";
import {IUiService} from "../../../../interfaces/services/ui-service.interface";
import {IToastrService} from "angular-toastr";
import {TokenViewModel} from "../../../../view-models/users/token.view-model";
import {ILocalStorageService} from "angular-local-storage";
import {LocalStorageKeyConstant} from "../../../../constants/local-storage-key.constant";
import {UrlStateConstant} from "../../../../constants/url-state.constant";
import {UploadProfileImageViewModel} from "../../../../view-models/users/upload-profile-image.view-model";
import {UserRole} from "../../../../enums/user-role.enum";
import {GeneralInfoResolver} from "./general-info.resolver";

/* @ngInject */
export class ProfileGeneralInfoController implements IController {

    //#region Properties

    // Upload profile image modal.
    private _uploadProfileImageModal: IModalInstanceService = null;

    // Change password modal.
    private _changePasswordModal: IModalInstanceService = null;

    //#endregion

    //#region Constructor

    public constructor(public profile: User,
                       public routeResolver: GeneralInfoResolver,
                       public $uibModal: IModalService, public toastr: IToastrService,
                       public $translate: angular.translate.ITranslateService, public localStorageService: ILocalStorageService,
                       public $user: IUserService,
                       public $file: IFileService, public $ui: IUiService,
                       public $scope: IProfileGeneralInfoScope, public FileUploader: FileUploaderFactory) {

        // Properties binding.
        $scope.urlStateConstant = UrlStateConstant;

        $scope.user = routeResolver.user;
        $scope.availableUserStatuses = $user.loadUserAvailableStatuses();
        $scope.blobProfileImage = null;
        $scope.encodedProfileImage = '';
        $scope.originalProfileImage = '';

        // Profile image uploader.
        let profileImageUploader = new FileUploader({
            removeAfterUpload: true
        });

        profileImageUploader.onAfterAddingFile = this._ngOnAfterAddingProfileImage;
        $scope.profileImageUploader = profileImageUploader;

        // Method binding.
        $scope.ngOnUploadProfileModalClicked = this._ngOnUploadProfileModalClicked;
        $scope.ngOnProfileModalCancelClicked = this._ngOnProfileModalCancelClicked;
        $scope.ngOnProfileImageCropped = this._ngOnProfileImageCropped;
        $scope.ngIsAbleToResetCroppedImage = this._ngIsAbleToResetCroppedImage;
        $scope.ngOnResetOriginalImageClicked = this._ngOnResetOriginalImageClicked;
        $scope.ngOnChangePasswordClicked = this._ngOnChangePasswordClicked;
        $scope.ngIsAbleToChangeProfileImage = this._ngIsAbleToChangeProfileImage;
        $scope.ngIsAbleToSeeFollowingTopics = this._ngIsAbleToSeeFollowingTopics;
    }

    //#endregion

    //#region Methods

    // Called when profile upload modal is clicked.
    private _ngOnUploadProfileModalClicked = (): void => {
        let options: IModalSettings = {};
        options.size = 'md';
        options.templateUrl = 'upload-profile-image.html';
        options.scope = this.$scope;

        // Clear image.
        this.$scope.originalProfileImage = '';

        if (this._uploadProfileImageModal)
            this._uploadProfileImageModal.dismiss();

        this._uploadProfileImageModal = this.$uibModal
            .open(options);
    };

    /*
    * Called when a file is added to profile image.
    * */
    private _ngOnAfterAddingProfileImage = (fileItem: any): void => {

        // Add loading screen.
        this.$ui.blockAppUI();

        // File item is invalid.
        let file = fileItem._file;
        this.$file.toEncodedFile(file)
            .then((base64EncodedFile: string | ArrayBuffer) => {
                this.$scope.originalProfileImage = <string> base64EncodedFile;
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    // Called when cancel button of profile image modal is clicked.
    private _ngOnProfileModalCancelClicked = (): void => {

        // Modal is valid. Dimiss it.
        if (!this._uploadProfileImageModal)
            return;

        this._uploadProfileImageModal.dismiss();
        this._uploadProfileImageModal = null;
    };

    // Called when profile image is cropped.
    private _ngOnProfileImageCropped = ($event: IAngularEvent, encodedProfileImage: string, blobProfileImage: any): void => {

        // Prevent form default behavior.
        if ($event)
            $event.preventDefault();

        // Block screen access.
        this.$ui.blockAppUI();

        let model = new UploadProfileImageViewModel();
        model.photo = blobProfileImage;
        model.userId = this.$scope.user.id;

        this.$user.uploadProfileImage(model)
            .then((photoUrl: string) => {
                // Get translated message.
                let message = this.$translate.instant('MSG_PROFILE_IMAGE_UPLOADED_SUCCESSFULLY');
                this.toastr.success(message);

                // Dismiss the modal dialog.
                if (this._uploadProfileImageModal) {
                    this._uploadProfileImageModal.dismiss();
                    this._uploadProfileImageModal = null;
                }

                // Update user profile image.
                this.$scope.user.photo = photoUrl;
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    // Check whether user is able to reset cropped image or not.
    private _ngIsAbleToResetCroppedImage = (originalImage: string): boolean => {
        // No image has been selected.
        if (!originalImage)
            return false;

        return true;
    };

    // Called when reset original image is clicked.
    private _ngOnResetOriginalImageClicked = (): void => {
        this.$scope.profileImageUploader.clearQueue();
        let fileUploader = this.$ui.getElement('#profileImageSelector');
        if (fileUploader)
            fileUploader.val(null);

        this.$scope.originalProfileImage = null;
    };

    // Called when change change password is clicked.
    private _ngOnChangePasswordClicked = (): void => {

        if (this._changePasswordModal)
            this._changePasswordModal.dismiss();

        let options: IModalSettings = {};
        options.size = 'md';
        options.templateUrl = 'change-password.html';
        options.controller = 'changePasswordController';

        this._changePasswordModal = this.$uibModal
            .open(options);

        this._changePasswordModal.result
            .then((token: TokenViewModel) => {
                // Update access token.
                this.localStorageService.set<TokenViewModel>(LocalStorageKeyConstant.accessTokenKey, token);

                // Display success message.
                let message = this.$translate.instant('MSG_PASSWORD_CHANGED_SUCCESSFULLY');
                this.toastr.success(message);
            })
            .catch(() => {
            })
    };

    // Check whether view can change profile image or not.
    private _ngIsAbleToChangeProfileImage = (): boolean => {
        if (this.profile.id == this.$scope.user.id)
            return true;

        if (this.profile.role == UserRole.admin)
            return true;

        return false;
    };

    // Check whether user is able to change profile password or not.
    private _ngIsAbleToChangePassword = (): boolean => {
        if (this.profile.id == this.$scope.user.id)
            return true;

        if (this.profile.role == UserRole.admin)
            return true;

        return false;
    };

    // Check whether current viewer is able to see following topics.
    private _ngIsAbleToSeeFollowingTopics = (): boolean => {
        if (this.profile.id == this.$scope.user.id)
            return true;

        if (this.profile.role == UserRole.admin)
            return true;

        return false;
    }
    //#endregion
}