import {LoadFollowingTopicViewModel} from "../../view-models/following-topic/load-following-topic.view-model";
import {SearchResult} from "../../models/search-result";
import {FollowingTopic} from "../../models/entities/following-topic";
import {IPromise} from "angular";

export interface IFollowingTopicService {

    //#region Methods

    // Stop following topic.
    deleteFollowingTopic(topicId: number): IPromise<void>;

    // Start following topic.
    followTopic(topicId: number): IPromise<FollowingTopic>;

    // Load following categories.
    loadFollowingTopics(loadFollowingTopicCondition: LoadFollowingTopicViewModel): IPromise<SearchResult<FollowingTopic>>

    //#endregion
}