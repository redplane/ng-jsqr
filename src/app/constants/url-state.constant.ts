export class UrlStateConstant {

    //#region Properties

    // Login module name.
    public static loginModuleName: string = 'login';

    // Login module url.
    public static loginModuleUrl: string = '/login';

    // Dashboard module name.
    public static dashboardModuleName: string = 'dashboard';

    // Dashboard module url.
    public static dashboardModuleUrl: string = '/dashboard';

    //#region Profile module

    // Profile module name.
    public static profileModuleName: string = 'profile';

    // Profile module url.
    public static profileModuleUrl: string = '/profile/{profileId:int}';

    public static profileFollowTopicModuleUrl: string = '/profile/follow-topic/{profileId: int}';

    public static profileFollowTopicModuleName: string = 'profile-follow-topic';

    public static profileFollowCategoryModuleName: string = 'profile-follow-category';

    public static profileFollowCategoryModuleUrl: string = '/follow-category/{profileId: int}';

    public static profileMasterLayoutModuleName: string = 'profile-master-layout';

    public static profileTopicsModuleName: string = 'profile-topics';

    public static profileTopicsModuleUrl: string = '/profile/topics/{profileId: int}';

    public static profileNotificationsModuleName: string = 'profile-notifications';

    public static profileNotificationModuleUrl: string = '/profile/notifications/{profileId: int}';

    //#endregion

    // Category topic module name.
    public static categoryDetailModuleName: string = 'category';

    // Category topic module url.
    public static categoryDetailModuleUrl: string = '/category/{categoryId:int}';

    // Topic module.
    public static topicModuleUrl: string = '/topic/:topicId';

    // Topic module name.
    public static topicModuleName: string = 'topic';

    // Following topics name.
    public static followingTopicsModuleName: string = 'following-topics';

    // Following categories name.
    public static followingCategoriesModuleName: string = 'following-categories';

    // Add topic url.
    public static addTopicModuleUrl: string = '/add-topic/:categoryId';

    // Add topic module name.
    public static addTopicModuleName: string = 'add-topic';

    // Edit topic module url.
    public static editTopicModuleUrl: string = '/edit-topic/:topicId';

    // Edit topic module name.
    public static editTopicModuleName: string = 'edit-topic';

    // Account registration module name.
    public static accountRegisterModuleName: string = 'account-basic-register';

    // Account registration module url.
    public static accountRegisterModuleUrl: string = '/basic-register';

    // Account forgot password.
    public static accountForgotPasswordModuleName: string = 'account-forgot-password';

    // Account forgot password url.
    public static accountForgotPasswordModuleUrl: string = '/forgot-password';

    // Authorized layout module name.
    public static authorizedLayoutModuleName: string = 'master-layout';

    // Unauthorized layout module name.
    public static unauthorizedLayoutModuleName: string = 'unauthorized-layout';

    // Google login module name.
    public static googleLoginModuleName: string = 'google-login';

    //#endregion
}