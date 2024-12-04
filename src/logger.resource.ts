import { ComponentLoader, ResourceWithOptions } from 'adminjs';

import { bundleComponent } from './utils/bundle-component.js';
import { ADMINJS_LOGGER_DEFAULT_RESOURCE_ID } from './constants.js';
import { LoggerFeatureOptions } from './types.js';
import { getLogPropertyName } from './utils/get-log-property-name.js';

export const createLoggerResource = <T = unknown>({
  componentLoader,
  resource,
  featureOptions,
}: {
  componentLoader: ComponentLoader;
  resource: T;
  featureOptions?: LoggerFeatureOptions;
}): ResourceWithOptions => {
  const { resourceOptions = {}, propertiesMapping = {} } = featureOptions ?? {};
  const { resourceId, navigation, actions = {} } = resourceOptions;
  const recordDifferenceComponent = bundleComponent(
    componentLoader,
    'RecordDifference'
  );
  const recordLinkComponent = bundleComponent(componentLoader, 'RecordLink');
  return {
    resource,
    options: {
      id: resourceId ?? ADMINJS_LOGGER_DEFAULT_RESOURCE_ID,
      navigation: navigation ?? null,
      sort: {
        direction: 'desc',
        sortBy: getLogPropertyName('createdAt', propertiesMapping),
      },
      listProperties: [
        getLogPropertyName('email', propertiesMapping),
        getLogPropertyName('recordId', propertiesMapping),
        getLogPropertyName('resource', propertiesMapping),
        getLogPropertyName('action', propertiesMapping),
        getLogPropertyName('createdAt', propertiesMapping),
      ],
      actions: {
        edit: { isAccessible: false },
        new: { isAccessible: false },
        delete: { isAccessible: false },
        bulkDelete: { isAccessible: false },
        show: {
          showInDrawer: true,
          containerWidth: '700px',
          ...(actions.show ?? {}),
        },
        list: {
          ...(actions.list ?? {}),
        },
      },
      properties: {
        [getLogPropertyName('id', propertiesMapping)]: {
          isVisible: {
            list: false,
          },
        },
        [getLogPropertyName('difference', propertiesMapping)]: {
          components: {
            show: recordDifferenceComponent,
          },
          custom: {
            propertiesMapping,
          },
          position: 110,
        },
        [getLogPropertyName('recordId', propertiesMapping)]: {
          components: {
            list: recordLinkComponent,
            show: recordLinkComponent,
          },
          custom: {
            propertiesMapping,
          },
        },
        [getLogPropertyName('updatedAt', propertiesMapping)]: {
          isVisible: false,
        },
      },
    },
  };
};
