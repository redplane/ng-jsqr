import {Pagination} from "../models/pagination";
import {ItemStatus} from "../enums/item-status.enum";

export class LoadCategoryViewModel {

    //#region Properties

    // List of category ids.
    public ids: Array<number> | null;

    // List of topics group indexes.
    public categoryGroupIds: Array<number> | null;

    // List of item statuses.
    public statuses: Array<ItemStatus> | null;

    // Pagination.
    public pagination: Pagination | null;

    //#endregion

    //#region Constructor

    public constructor(){
        this.ids = null;
        this.categoryGroupIds = null;
        this.pagination = new Pagination();
    }

    //#endregion
}