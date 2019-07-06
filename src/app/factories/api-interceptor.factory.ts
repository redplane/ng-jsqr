import {IHttpInterceptor, IPromise, IQService, IRequestConfig} from "angular";
import {ILocalStorageService} from "angular-local-storage";


export class ApiInterceptorFactory implements IHttpInterceptor {

    //#region Methods

    // Trigger when request is being prepared.
    request = (httpRequestConfiguration: IRequestConfig): IRequestConfig | IPromise<IRequestConfig> => {
        return httpRequestConfiguration;
    };


    //#endregion

    //#region Constructor

    // Initialize interceptor with settings.
    public constructor(public localStorageService: ILocalStorageService,
                       public $q: IQService) {
    }

    //#endregion
}