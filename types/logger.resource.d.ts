import { ComponentLoader, ResourceWithOptions } from 'adminjs';
import { LoggerFeatureOptions } from './types.js';
export declare const createLoggerResource: <T = unknown>({ componentLoader, resource, featureOptions, }: {
    componentLoader: ComponentLoader;
    resource: T;
    featureOptions?: LoggerFeatureOptions | undefined;
}) => ResourceWithOptions;
