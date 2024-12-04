import { LoggerPropertiesMapping } from '../types.js';

export const getLogPropertyName = (
  property: string,
  mapping: LoggerPropertiesMapping = {}
) => {
  if (!mapping[property]) {
    return property;
  }

  return mapping[property];
};
