import {
  Action,
  ComponentLoader,
  ListActionResponse,
  RecordActionResponse,
  ResourceOptions,
} from 'adminjs';

/**
 * Mapping object for Log model
 *
 * @memberof module:@adminjs/logger
 * @alias LoggerPropertiesMapping
 */
export type LoggerPropertiesMapping = {
  /**
   * Primary key of your Log model
   */
  id?: string;
  /**
   * Field to store logged record's id
   */
  recordId?: string;
  /**
   * Field to store logged record's title
   */
  recordTitle?: string;
  /**
   * Field to store changes between actions. This has to be a text type field
   * or JSON/JSONB for databases which support this type
   */
  difference?: string;
  /**
   * Field to store the id of the user who triggered the action
   */
  email?: string;
  /**
   * Field to store the action's name
   */
  action?: string;
  /**
   * Field to store the resource's name
   */
  resource?: string;
  /**
   * Timestamp field indicating when the log has been created
   */
  createdAt?: string;
  /**
   * Timestamp field indicating when the log has been updated
   */
  updatedAt?: string;
};

export type CreateLogActionParams = {
  onlyForPostMethod?: boolean;
  options?: LoggerActionOptions;
};

/**
 * Feature resource configuration object
 *
 * @memberof module:@adminjs/logger
 * @alias LoggerResourceOptions
 */
export type LoggerResourceOptions = {
  resourceId?: ResourceOptions['id'];
  navigation?: ResourceOptions['navigation'];
  actions?: {
    list?: Partial<Action<ListActionResponse>>;
    show?: Partial<Action<RecordActionResponse>>;
  };
};

/**
 * Feature configuration object
 *
 * @memberof module:@adminjs/logger
 * @alias LoggerFeatureOptions
 */
export type LoggerFeatureOptions = {
  /**
   * Your ComponentLoader instance. It is required for the feature to add it's components.
   */
  componentLoader: ComponentLoader;
  /**
   * For the feature to work you must define a model using an ORM of your choice.
   * In case you want to use different attribute names, you can use this
   * options to configure the mapping.
   */
  propertiesMapping?: LoggerPropertiesMapping;
  /**
   * Usually a primary key which identifies the currently logged in user.
   */
  userIdAttribute?: string;
  /**
   * Customization of logger's resource options. This is used by both Log resource and the feature.
   */
  resourceOptions?: LoggerResourceOptions;
};

export type LoggerActionOptions = Omit<LoggerFeatureOptions, 'componentLoader'>;
