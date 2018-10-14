import {Pagination} from "../models/pagination";

export class LoadTopicSummaryViewModel {

    //#region Properties

    public topicIds: Array<number> | null;

    public pagination: Pagination;

    //#endregion

    //#region Constructor

    public constructor(){
        this.pagination = new Pagination();
    }

    //#endregion
}