import {User} from "../entities/user";

export class AddUserSignatureModalResolver {

    //#region Properties

    // Method to resolve user information.
    user: User;

    //#endregion

    //#region Constructor

    public constructor(){
        this.user = new User();
    }

    //#endregion
}