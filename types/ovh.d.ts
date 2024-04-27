declare module 'ovh' {
    export default function(params: any): Ovh
}

// declare function _exports(params: any): Ovh;
// export = _exports;
declare class Ovh {
    constructor(params: any);
    appKey: string;
    appSecret: string;
    consumerKey: any;
    timeout: any;
    apiTimeDiff: any;
    endpoint: any;
    host: any;
    port: any;
    basePath: any;
    usedApi: any;
    warn: any;
    debug: any;
    apis: {
        _path: string;
    };
    apisLoaded: boolean;
    /**
     * Returns the endpoint's full path, if the endpoint's path starts
     * with /v1 or /v2, remove the trailing '/1.0' from the basePath
     */
    getFullPath(path: any): string;
    /**
     * Recursively loads the schemas of the specified used APIs.
     *
     * @param {String} path
     * @param {Function} callback
     */
    loadSchemas(path: string, callback: Function): any;
    /**
     * Add a fetched schema to the loaded API list
     *
     * @param {Array} apiPath: Splited API path using '/'
     * @param {String} api: API Name
     * @param {Function} callback
     */
    addApi(apiPath: any[], api: string, apis: any): any;
    /**
     * Fetch an API schema
     *
     * @param {Object} options: HTTP request options
     * @param {Function} callback
     */
    loadSchemasRequest(options: any, callback: Function): void;
    /**
     * Generates warns from the loaded API schema when processing a request
     *
     * A warn is generated when the API schema is loaded and:
     *  - The API method does not exists
     *  - The API method is not available with the provided httpMethod
     *  - The API method is tagged as deprecated in the schema
     *
     * The function called can be customzied by providing a function using the
     * 'warn' parameter when instancing the module. Default function used is
     * 'console.warn'.
     *
     * @param {String} httpMethod
     * @param {String} pathStr
     */
    warnsRequest(httpMethod: string, pathStr: string): any;
    /**
     * Execute a request on the API
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     * @param {Function} callback
     * @param {Object} refer The parent proxied object
     */
    request(httpMethod: string, path: string, params: any, callback: Function, refer?: any): any;
    
    /**
     * Execute a request on the API
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Function} callback
     */
    request(httpMethod: string, path: string, callback: Function): any;
    /**
     * Execute a request on the API with promise
     *
     * @param {String} httpMethod: The HTTP method
     * @param {String} path: The request path
     * @param {Object} params: The request parameters (passed as query string or
     *                         body params)
     */
    requestPromised(httpMethod: string, path: string, params: any): any;
    /**
     * Signs an API request
     *
     * @param {String} httpMethod
     * @param {String} url
     * @param {String} body
     * @param {Number|String} timestamp
     * @return {String} The signature
     */
    signRequest(httpMethod: string, url: string, body: string, timestamp: number | string): string;
}
//# sourceMappingURL=ovh.es6.d.ts.map