import {Category} from "../../../models/entities/category";
import {Topic} from "../../../models/entities/topic";

export class AddEditTopicResolver {

    //#region Properties

    /*
    * Category which has been selected.
    * */
    public category: Category;

    /*
    * Topic which is for editing.
    * */
    public topic: Topic;

    //#endregion

}