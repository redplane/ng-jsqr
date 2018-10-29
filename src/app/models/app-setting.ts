import {CloudMessagingOption} from "./cloud-messaging-option";
import {HubOption} from "./hub-option";

export class AppSetting {

    public apiEndPoint: string = '';

    public captchaPublicKey: string = '';

    public clientIdGoogle: string = '';

    public clientScopeGoogle: string = '';

    public clientIdFacebook: string = '';

    public clientScopeFacebook: string = '';

    public apiKeyPusher: string = '';

    public clusterPusher: string = '';

    public cloudMessaging: CloudMessagingOption = new CloudMessagingOption();

    public hub: HubOption = new HubOption();
}