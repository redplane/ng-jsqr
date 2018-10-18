import {StateProvider} from "@uirouter/angularjs";
import {ProfileMasterLayoutModule} from './master-layout';
import {ProfileMasterInfoModule} from './master-info';
import {ProfileFollowTopicModule} from './following-topics';
import {ProfileFollowCategoryModule} from './following-categories';
import {ProfileNotificationModule} from './notifications';
import {ProfileTopicModule} from "./topics";

export class ProfileModule {

    //#region Constructor

    public constructor($stateProvider: StateProvider) {
        new ProfileMasterLayoutModule($stateProvider);
        new ProfileMasterInfoModule($stateProvider);
        new ProfileFollowTopicModule($stateProvider);
        new ProfileFollowCategoryModule($stateProvider);
        new ProfileNotificationModule($stateProvider);
        new ProfileTopicModule($stateProvider);

    };

    //#endregion
}