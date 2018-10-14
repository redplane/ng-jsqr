import {ICategoryService} from "../interfaces/services/category-service.interface";
import {LoadCategoryViewModel} from "../view-models/load-category.view-model";
import {SearchResult} from "../models/search-result";
import {Category} from "../models/entities/category";
import {IHttpResponse, IHttpService, IPromise} from "angular";
import {LoadCategorySummaryViewModel} from "../view-models/category/load-category-summary.view-model";
import {CategorySummary} from "../models/entities/category-summary";

/* @ngInject */
export class CategoryService implements ICategoryService {

    //#region Constructors

    public constructor(public $http: IHttpService,
                       public appSettingConstant: any){

    }

    //#endregion

    //#region Methods

    /*
    * Load categories by using specific conditions.
    * */
    public loadCategories(loadCategoriesCondition: LoadCategoryViewModel): IPromise<SearchResult<Category>> {

        // Build url.
        let fullUrl = `${this.appSettingConstant.apiEndPoint}/api/category/search`;

        return this.$http
            .post(fullUrl, loadCategoriesCondition)
            .then((loadCategoriesResponse: IHttpResponse<SearchResult<Category>>) => {
                if (!loadCategoriesResponse || !loadCategoriesResponse.data)
                    throw 'No topics has been found';

                return loadCategoriesResponse.data;
            });
    }

    /*
    * Load category using id.
    * */
    public loadCategoryUsingId(id: number): IPromise<Category> {
        // Build url.
        let fullUrl = `${this.appSettingConstant.apiEndPoint}/api/category/${id}`;

        return this.$http
            .get(fullUrl)
            .then((loadCategoryResponse: IHttpResponse<Category>) => {
                if (!loadCategoryResponse || !loadCategoryResponse.data)
                    throw 'No category has been found';

                return loadCategoryResponse.data;
            });
    }

    /*
    * Load category summaries using specific condition.
    * */
    public loadCategorySummaries(loadCategorySummariesCondition: LoadCategorySummaryViewModel): IPromise<SearchResult<CategorySummary>> {
        // Build url.
        const fullUrl = `${this.appSettingConstant.apiEndPoint}/api/category-summary/search`;

        return this.$http
            .post(fullUrl, loadCategorySummariesCondition)
            .then((loadCategorySummariesResult: IHttpResponse<SearchResult<CategorySummary>>) => {
                if (!loadCategorySummariesResult || !loadCategorySummariesResult.data)
                    throw 'No category summary has been found';

                return loadCategorySummariesResult.data;
            });
    }

    //#endregion
}