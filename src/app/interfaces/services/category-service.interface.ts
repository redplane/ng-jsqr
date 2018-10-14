import {LoadCategoryViewModel} from "../../view-models/load-category.view-model";
import {SearchResult} from "../../models/search-result";
import {Category} from "../../models/entities/category";
import {IPromise} from "angular";
import {LoadCategorySummaryViewModel} from "../../view-models/category/load-category-summary.view-model";
import {CategorySummary} from "../../models/entities/category-summary";

export interface ICategoryService {

    //#region Methods

    /*
    * Load category using id.
    * */
    loadCategoryUsingId(id: number) : IPromise<Category>;

    /*
    * Load categories by using specific conditions.
    * */
    loadCategories(loadCategoriesCondition: LoadCategoryViewModel): IPromise<SearchResult<Category>>;

    /*
    * Load category summaries using specific conditions.
    * */
    loadCategorySummaries(loadCategorySummariesCondition: LoadCategorySummaryViewModel): IPromise<SearchResult<CategorySummary>>

    //#endregion

}