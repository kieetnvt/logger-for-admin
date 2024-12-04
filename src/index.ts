/**
 * @module @adminjs/logger
 * @subcategory Features
 * @section modules
 */

import loggerFeature from './logger.feature.js';

export * from './constants.js';
export { createLoggerResource } from './logger.resource.js';
export * from './types.js';
export { withLogger } from './utils/with-logger.js';

export default loggerFeature;
