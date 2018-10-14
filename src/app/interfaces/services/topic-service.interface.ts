import {LoadTopicViewModel} from "../../view-models/load-topic.view-model";
import {SearchResult} from "../../models/search-result";
import {Topic} from "../../models/entities/topic";
import {IPromise} from "angular";
import {UrlStateConstant} from "../../constants/url-state.constant";
import {LoadTopicSummaryViewModel} from "../../view-models/load-topic-summary.view-model";
import {TopicSummary} from "../../models/entities/topic-summary";

export interface ITopicService {

    //#region Methods

    // Add topic to service end-point.
    addTopic(topic: Topic): IPromise<Topic>;

    // Edit topic using specific information.
    editTopic(topic: Topic): IPromise<Topic>;

    // Load topics using specific conditions.
    loadTopics(loadTopicsCondition: LoadTopicViewModel): IPromise<SearchResult<Topic>>;

    // Load topic summaries using specific conditions.
    loadTopicSummaries(condition: LoadTopicSummaryViewModel): IPromise<SearchResult<TopicSummary>>;

    //#endregion

}