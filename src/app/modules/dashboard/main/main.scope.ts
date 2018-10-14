import {IScope} from "angular";
import {SearchResult} from "../../../models/search-result";
import {CategoryGroup} from "../../../models/entities/category-group";
import {LoadCategoryGroupViewModel} from "../../../view-models/load-category-group.view-model";
import {Category} from "../../../models/entities/category";
import {CategorySummary} from "../../../models/entities/category-summary";

export interface IMainScope extends IScope {

    //#region Properties

    /*
    * List of category groups that have been searched.
    * */
    loadCategoryGroupsResult: SearchResult<CategoryGroup>;

    /*
    * Search condition of category groups.
    * */
    loadCategoryGroupsCondition: LoadCategoryGroupViewModel;

    /*
    * Map of category group id and its related categories.
    * */
    mCategoryGroupIdToCategoriesMap: {[id: number]: Array<Category>};

    /*
    * Mapping of id to summary category.
    * */
    mIdToCategorySummaryMap: {[id: number]: CategorySummary};

    //#endregion

    //#region Methods

    /*
    * Called when component is initialized.
    * */
    ngOnInit(): void;

    /*
    * Called when category groups is searched.
    * */
    ngOnLoadCategoryGroups(): void;

    /*
    * Called when category is clicked.
    * */
    ngOnCategoryClicked(categoryId: number): void;

    ngGetCategoryTotalPost(categoryId: number): number;

    ngGetCategoryLastTopicTitle(categoryId: number): string;

    ngGetCategoryLastTopicCreatedTime(categoryId: number): number;

    ngOnTopicClicked(categoryId: number): number;

    //#endregion
}