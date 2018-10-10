import {SortDirection} from "../enums/order/sort-direction.enum";

export class SortViewModel<T> {

    //#region Properties

    public property: T;

    public direction: SortDirection;

    //#endregion
}