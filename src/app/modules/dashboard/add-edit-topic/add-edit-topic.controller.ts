import {IAngularEvent, IController, IPromise} from "angular";
import {IAddEditTopicScope} from "./add-edit-topic.scope";
import {Topic} from "../../../models/entities/topic";
import {StateService} from "@uirouter/core";
import {UrlStateConstant} from "../../../constants/url-state.constant";
import {LoadCategoryViewModel} from "../../../view-models/load-category.view-model";
import {Category} from "../../../models/entities/category";
import {SearchResult} from "../../../models/search-result";
import {ICategoryService} from "../../../interfaces/services/category-service.interface";
import {IUiService} from "../../../interfaces/services/ui-service.interface";
import {ITopicService} from "../../../interfaces/services/topic-service.interface";
import {ItemStatus} from "../../../enums/item-status.enum";
import {AddEditTopicResolver} from "./add-edit-topic.resolver";
import {CategoryDetailStateParam} from "../../../models/params/category-detail.state-param";

/* @ngInject */
export class AddEditTopicController implements IController {

    //#region Properties


    //#endregion

    //#region Constructor

    /*
    * Initialize controller with injectors.
    * */
    public constructor(public $state: StateService,
                       public $scope: IAddEditTopicScope,
                       public $ui: IUiService,
                       public $category: ICategoryService, public $topic: ITopicService,
                       routeResolver: AddEditTopicResolver | null) {
        // Property binding.

        $scope.topic = routeResolver.topic ? routeResolver.topic : new Topic();
        $scope.category =routeResolver.category;
        $scope.topic.categoryId = $scope.category.id;

        $scope.bIsInPreviewMode = false;

        // Methods binding.
        $scope.ngOnTopicSubmitted = this._ngOnTopicSubmitted;
        $scope.ngOnPreviewToggled = this._ngOnPreviewToggled;
        $scope.ngOnCancelClicked = this._ngOnCancelClicked;
        $scope.ngOnInit = this._ngOnInit;
    }

    //#endregion

    //#region Methods

    /*
    * Called when add topic
    * */
    private _ngOnTopicSubmitted = ($event: IAngularEvent): void => {

        // Prevent default behavior.
        if ($event)
            $event.preventDefault();

        // Get topic information.
        let topic = this.$scope.topic;

        // Block screen ui.
        this.$ui.blockAppUI();

        if (!topic.id) {
            this.$topic.addTopic(topic)
                .then((topic: Topic) => {
                    // Redirect user to category.
                    this.$state.go(UrlStateConstant.categoryDetailModuleName, {categoryId: topic.categoryId});
                })
                .finally(() => {
                    this.$ui.unblockAppUI();
                });

            return;
        }

        this.$topic.editTopic(topic)
            .then((topic: Topic) => {
                // Redirect to topic page.
                this.$state.go(UrlStateConstant.topicModuleName, {topicId: topic.id});
            })
            .finally(() => {
                this.$ui.unblockAppUI();
            });
    };

    /*
    * Called when preview mode is toggled.
    * */
    private _ngOnPreviewToggled = (): void => {
        this.$scope.bIsInPreviewMode = !this.$scope.bIsInPreviewMode;
    };

    /*
    * Called when cancel is clicked.
    * */
    private _ngOnCancelClicked = (): void => {
        // Get topic.
        let topic = this.$scope.topic;

        // In edit mode.
        if (topic.id) {
            // Redirect to topic page.
            this.$state.go(UrlStateConstant.topicModuleName, {topicId: topic.id});
            return;
        }

        let categoryDetailStateParam = new CategoryDetailStateParam();
        categoryDetailStateParam.categoryId = this.$scope.category.id;
        // Redirect to topics page.
        this.$state.go(UrlStateConstant.categoryDetailModuleName, categoryDetailStateParam);

    };

    // Called when component is initialized.
    private _ngOnInit = (): void => {
    };

    // Load all selectable categories.
    private _loadCategories(): IPromise<Category[]> {
        let conditions = new LoadCategoryViewModel();
        conditions.statuses = [ItemStatus.available];

        return this.$category
            .loadCategories(conditions)
            .then((loadCategoriesResult: SearchResult<Category>) => {
                return loadCategoriesResult.records;
            });

    };

    //#endregion
}