import {IFollowingCategoryService} from "../interfaces/services/following-category-service.interface";
import {LoadFollowingCategoryViewModel} from "../view-models/following-category/load-following-category.view-model";
import {SearchResult} from "../models/search-result";
import {IHttpResponse, IHttpService, IPromise} from "angular";
import {FollowingCategory} from "../models/entities/following-category";
import {AppSetting} from "../models/app-setting";

export class FollowingCategoryService implements IFollowingCategoryService {

    //#region Constructor

    public constructor(public appSettingConstant: AppSetting,
                       public $http: IHttpService){
    }

    //#endregion

    //#region Methods

    // Load following categories.
    public loadFollowingCategories(condition: LoadFollowingCategoryViewModel): IPromise<SearchResult<FollowingCategory>> {
        let url: string = `${this.appSettingConstant.apiEndPoint}/api/follow-category/search`;
        return this.$http
            .post(url, condition)
            .then((loadFollowingCategoriesResponse: IHttpResponse<SearchResult<FollowingCategory>>) => {
                if (!loadFollowingCategoriesResponse)
                    throw 'No following category has been found';

                return loadFollowingCategoriesResponse.data;
            });
    };

    // Stop following category.
    public stopFollowingCategory(categoryId: number): IPromise<void> {
        let url: string = `${this.appSettingConstant.apiEndPoint}/api/follow-category/${categoryId}`;
        return this.$http
            .delete(url)
            .then(() => {
                return void(0);
            });
    };

    // Start following category.
    public followCategory(categoryId: number): IPromise<FollowingCategory> {
        let url = `${this.appSettingConstant.apiEndPoint}/api/follow-category/${categoryId}`;
        return this.$http
            .post(url, {})
            .then((followCategoryResponse: IHttpResponse<FollowingCategory>) => {
                if (!followCategoryResponse)
                    throw 'Cannot follow the category.';

                return followCategoryResponse.data;
            });
    }


    //#endregion

}