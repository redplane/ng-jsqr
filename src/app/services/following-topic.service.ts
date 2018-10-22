import {IFollowingTopicService} from "../interfaces/services/following-topic-service.interface";
import {FollowingTopic} from "../models/entities/following-topic";
import {LoadFollowingTopicViewModel} from "../view-models/following-topic/load-following-topic.view-model";
import {SearchResult} from "../models/search-result";
import {IHttpResponse, IHttpService, IPromise} from "angular";
import {AppSetting} from "../models/app-setting";

/* @ngInject */
export class FollowingTopicService implements IFollowingTopicService {

    //#region Constructors

    public constructor(public $http: IHttpService,
                       public appSettingConstant: AppSetting){

    }

    //#endregion

    //#region Methods

    // Load following categories using specific conditions.
    public loadFollowingTopics(loadFollowingTopicCondition: LoadFollowingTopicViewModel): IPromise<SearchResult<FollowingTopic>> {
        let url = `${this.appSettingConstant.apiEndPoint}/api/follow-topic/search`;
        return this.$http
            .post(url, loadFollowingTopicCondition)
            .then((loadFollowingTopicResponse: IHttpResponse<SearchResult<FollowingTopic>>) => {
                if (!loadFollowingTopicResponse)
                    throw 'No following topic is found';

                let loadFollowingTopicResult = loadFollowingTopicResponse.data;
                if (!loadFollowingTopicResult)
                    throw 'No following topic is found';

                return loadFollowingTopicResult;
            });
    }

    // Delete following topic.
    public deleteFollowingTopic(topicId: number): IPromise<void> {
        let url = `${this.appSettingConstant.apiEndPoint}/api/follow-topic/${topicId}`;
        return this.$http
            .delete(url, {})
            .then(() => {
                return void(0);
            });
    };

    // Follow topic.
    public followTopic(topicId: number): IPromise<FollowingTopic> {
        let url = `${this.appSettingConstant.apiEndPoint}/api/follow-topic/${topicId}`;
        return this.$http
            .post(url, {})
            .then((followTopicResponse: IHttpResponse<FollowingTopic>) => {
                if (!followTopicResponse)
                    throw 'Cannot follow the topic';

                return followTopicResponse.data;
            });
    }




    //#endregion
}