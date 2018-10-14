import {Pagination} from "../../models/pagination";

export class LoadCategorySummaryViewModel {

    //#region Properties

    public categoryIds: Array<number> | null;

    public pagination: Pagination;

    //#endregion

    //#region Constructor

    public constructor(){
        this.pagination = new Pagination();
    }

    //#endregion
}