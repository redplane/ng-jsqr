import {Pagination} from "../models/pagination";
import {SortViewModel} from "./sort.view-model";
import {ReplySortProperty} from "../enums/order/reply-sort-property.enum";

export class LoadReplyViewModel {

    //#region Properties

    /*
    * Reply indexes.
    * */
    public ids: Array<number> | null = null;

    /*
    * Reply owner indexes.
    * */
    public ownerIds: Array<number> | null = null;

    /*
    * Topic indexes.
    * */
    public topicIds: Array<number> | null = null;

    /*
    * Pagination information.
    * */
    public pagination: Pagination;

    /*
    * Sort information.
    * */
    public sort: SortViewModel<ReplySortProperty>;

    //endregion

}