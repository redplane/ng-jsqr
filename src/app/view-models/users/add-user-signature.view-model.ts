export class AddUserSignatureViewModel {

    //#region Properties

    public userId: number | null;

    public signature: string;

    //#endregion

    //#region Constructor

    public constructor(){
        this.userId = null;
        this.signature = '';
    }

    //#endregion
}