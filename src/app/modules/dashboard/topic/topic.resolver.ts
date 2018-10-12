import {Topic} from "../../../models/entities/topic";
import {Category} from "../../../models/entities/category";

export class TopicResolver {

    //#region Properties

    /*
    * Topic that has been found on api end-point.
    * */
    topic: Topic | null;

    /*
    * Category to which topic belongs.
    * */
    category: Category | null;

    //#endregion

}