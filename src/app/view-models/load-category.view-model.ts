import {Pagination} from "../models/pagination";

export class LoadCategoryViewModel {

    //#region Properties

    // List of category ids.
    public ids: Array<number> | null;

    // List of topics group indexes.
    public categoryGroupIds: Array<number> | null;

    // Pagination.
    public pagination: Pagination | null;

    //#endregion

    //#region Constructor

    public constructor(){
        this.categoryGroupIds = null;
        this.pagination = new Pagination();
    }

    //#endregion
}