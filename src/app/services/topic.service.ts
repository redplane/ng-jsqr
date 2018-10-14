import {ITopicService} from "../interfaces/services/topic-service.interface";
import {LoadTopicViewModel} from "../view-models/load-topic.view-model";
import {SearchResult} from "../models/search-result";
import {Topic} from "../models/entities/topic";
import {IHttpResponse, IHttpService, IPromise} from "angular";
import {AppSetting} from "../models/app-setting";
import {LoadTopicSummaryViewModel} from "../view-models/load-topic-summary.view-model";
import {TopicSummary} from "../models/entities/topic-summary";

/* @ngInject */
export class TopicService implements ITopicService {


    //#region Constructor

    /*
    * Initialize service with injectors.
    * */
    public constructor(public appSettingConstant: AppSetting,
                       public $http: IHttpService){
    }

    //#endregion

    //#region Methods

    // Add topic with specific information.
    public addTopic(topic: Topic): IPromise<Topic> {
        let url = `${this.appSettingConstant.apiEndPoint}/api/topic`;
        return this.$http
            .post(url, topic)
            .then((addTopicResponse: IHttpResponse<Topic>) => {
                if (!addTopicResponse)
                    throw 'Failed to add topic';

                return addTopicResponse.data;
            });
    };

    // Edit topic using specific information.
    public editTopic(topic: Topic): IPromise<Topic>{
        let url = `${this.appSettingConstant.apiEndPoint}/api/topic/${topic.id}`;
        return this.$http
            .put(url, topic)
            .then((addTopicResponse: IHttpResponse<Topic>) => {
                if (!addTopicResponse)
                    throw 'Failed to add topic';

                return addTopicResponse.data;
            });
    };

    // Load topics using specific conditions.
    public loadTopics(loadTopicsCondition: LoadTopicViewModel): angular.IPromise<SearchResult<Topic>> {
        // Construct url.
        let url = `${this.appSettingConstant.apiEndPoint}/api/topic/search`;
        return this.$http
            .post(url, loadTopicsCondition)
            .then((loadTopicsResponse: IHttpResponse<SearchResult<Topic>>) => {
                if (!loadTopicsResponse)
                    throw 'No topics group has been found';

                let loadTopicsResult = loadTopicsResponse.data;
                if (!loadTopicsResult || !loadTopicsResult.records)
                    throw 'No topics group has been found';

                return loadTopicsResult;
            });
    };

    // Load topic summaries using specific condition.
    public loadTopicSummaries(condition: LoadTopicSummaryViewModel): IPromise<SearchResult<TopicSummary>> {
        // Construct url.
        let url = `${this.appSettingConstant.apiEndPoint}/api/topic-summary/search`;
        return this.$http
            .post(url, condition)
            .then((loadTopicSummariesResponse: IHttpResponse<SearchResult<TopicSummary>>) => {
                if (!loadTopicSummariesResponse)
                    throw 'No topic summaries group has been found';

                let loadTopicSummariesResult = loadTopicSummariesResponse.data;
                if (!loadTopicSummariesResult || !loadTopicSummariesResult.records)
                    throw 'No topic summaries has been found';

                return loadTopicSummariesResult;
            });
    }

    //#endregion
}