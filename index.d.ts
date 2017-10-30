declare module "moleculer-web" {
    import { CallOptions, Context, Transporters, Errors, GenericObject, ServiceSchema, ServiceSettingSchema } from "moleculer";
    import { IncomingMessage, ServerResponse } from "http";
    import { ServeStaticOptions } from "serve-static";

    class InvalidRequestBodyError extends Errors.MoleculerError { constructor(body: any, error: any) }
    class InvalidResponseTypeError extends Errors.MoleculerError { constructor(dataType: string) }
    class UnAuthorizedError extends Errors.MoleculerError { constructor(type: string, data: any) }
    class ForbiddenError extends Errors.MoleculerError { constructor(type: string, data: any) }
    class BadRequestError extends Errors.MoleculerError { constructor(type: string, data: any) }
    class RateLimitExceeded extends Errors.MoleculerClientError { constructor(type: string, data: any) }

    interface ApiGatewayErrors {
        InvalidRequestBodyError: InvalidRequestBodyError;
        InvalidResponseTypeError: InvalidResponseTypeError;
        UnAuthorizedError: UnAuthorizedError;
        ForbiddenError: ForbiddenError;
        BadRequestError: BadRequestError;
        RateLimitExceeded: RateLimitExceeded;

        ERR_NO_TOKEN: "ERR_NO_TOKEN";
        ERR_INVALID_TOKEN: "ERR_INVALID_TOKEN";
        ERR_UNABLE_DECODE_PARAM: "ERR_UNABLE_DECODE_PARAM";
    }

    export interface AssetsSetting {
        path: string;
        options: ServeStaticOptions;
    }

    export type RouteHandler = (route: RouteSetting, req: IncomingMessage, res: ServerResponse) => Promise<any>;

    export interface RouteAlias {
        [path: string]: string | RouteHandler
    }

    // http://moleculer.services/docs/moleculer-web.html#Service-settings
    export interface RouteSetting {
        auhorization: boolean;
        path: string;
        whitelist?: Array<string | RegExp>;
        mappingPolicy: "all" | "restrict";
        aliases?: RouteAlias;
        callOptions: CallOptions;
        cors: {
            // Configures the Access-Control-Allow-Origin CORS header.
            origin?: string;
            // Configures the Access-Control-Allow-Methods CORS header.
            methods?: Array<string>;
            // Configures the Access-Control-Allow-Headers CORS header.
            allowedHeaders?: Array<string>;
            // Configures the Access-Control-Expose-Headers CORS header.
            exposedHeaders?: Array<string>;
            // Configures the Access-Control-Allow-Credentials CORS header.
            credentials?: boolean;
            // Configures the Access-Control-Max-Age CORS header.
            maxAge?: number;
        };
        rateLimit: {
            // How long to keep record of requests in memory (in milliseconds).
            // Defaults to 60000 (1 min)
            window?: number;
            // Max number of requests during window. Defaults to 30
            limit?: number;

            // Set rate limit headers to response. Defaults to false
            headers?: boolean;
            // Function used to generate keys
            key?: (req: IncomingMessage) => string;
            StoreFactory?: CustomStore;
        };
        onBeforeCall(ctx: Context, route: RouteSetting, req: IncomingMessage, res: ServerResponse): void;
        onAfterCall(ctx: Context, route: RouteSetting, req: IncomingMessage, res: ServerResponse, data: any): Promise<any>;
    }

    abstract class CustomStore {
        constructor(window, opts);
        /**
         * Increment the counter by key
         *
         * @param {String} key
         * @returns {Number}
         */
        inc(key: string): number
        /**
         * Reset all counters
         */
        reset(): void
    }

    export interface ApiGatewaySettings extends ServiceSettingSchema {
        port?: number;
        host?: string;
        assets?: AssetsSetting;
        routes:? Route[];
    }

    export class HttpTransport extends Transporters.BaseTransport {}

    const ApiGatewayService: ServiceSchema & { Errors: ApiGatewayErrors };
    export = ApiGatewayService;
}
