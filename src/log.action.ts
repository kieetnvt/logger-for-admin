import {
  ActionContext,
  ActionRequest,
  ActionResponse,
  After,
  AppError,
  BaseRecord,
  Before,
  flat,
} from 'adminjs';

import { ADMINJS_LOGGER_DEFAULT_RESOURCE_ID } from './constants.js';
import { MISSING_USER_ID_ERROR } from './errors.js';
import { CreateLogActionParams, LoggerActionOptions } from './types.js';
import { difference } from './utils/difference.js';
import { getLogPropertyName } from './utils/get-log-property-name.js';

export const rememberInitialRecord: Before = async (
  request: ActionRequest,
  context: ActionContext
) => {
  const { action, records } = context;
  if (action.isBulkType()) {
    if (records?.length) {
      context.initialRecords = [...records];
    } else {
      context.initialRecords = request.query?.recordIds
        ? await context.resource.findMany(
            request.query.recordIds.split(','),
            context
          )
        : [];
    }

    return request;
  }

  if (records?.length) {
    context.initialRecords = [...records];
  }

  const id = context.record?.id?.() ?? request.params.recordId;
  context.initialRecord = id ? await context.resource.findOne(id, context) : {};

  return request;
};

const getRecordTitle = (modifiedRecord, currentAdmin) => {
  const recordJson =
    typeof modifiedRecord.toJSON === 'function'
      ? modifiedRecord.toJSON(currentAdmin)
      : modifiedRecord;
  return recordJson?.title ?? 'No title';
};

export const createLogAction =
  ({
    onlyForPostMethod = false,
    options = {},
  }: CreateLogActionParams = {}): After<ActionResponse> =>
  async (response, request, context) => {
    const { records, record, action, initialRecord, initialRecords } = context;
    const { params, method } = request;

    if (
      (onlyForPostMethod && method !== 'post') ||
      Object.keys(record?.errors || {}).length
    ) {
      return response;
    }

    const persistLog = createPersistLogAction(request, context, options);

    if (action.isBulkType()) {
      await Promise.all(
        (records || []).map(async record => {
          const recordId = record.id();
          await persistLog({
            recordId,
            record,
            initialRecord: initialRecords.find(r => {
              return r.id() === recordId;
            }),
          });
        })
      );
    } else if (action.isResourceType()) {
      let recordsIds = (response.records ?? []).map(r => r.id ?? r.params.id);
      if (!recordsIds?.length) {
        recordsIds = (records ?? []).map(r => r.id());
      }
      let recordId = response.record?.id ?? response.record?.params?.id;
      if (!recordId) {
        recordId = record?.id?.();
      }

      if (recordsIds?.length) {
        await Promise.all(
          recordsIds.map(async id => {
            return persistLog({
              recordId: id,
              record: (records ?? []).find(r => r.id() === id),
              initialRecord: initialRecords.find(r => {
                return r.id() === id;
              }),
            });
          })
        );
      }

      if (recordId) {
        await persistLog({
          recordId,
          record,
          initialRecord,
        });
      }
    } else {
      // record action
      // Record action with ":recordId" param in request url
      let { recordId } = params;

      // Record action should have record in context
      if (!recordId) {
        recordId = record?.id?.();
      }

      // Otherwise the "recordId" could be present in original response's record.
      if (!recordId) {
        recordId = response.record?.id ?? response.record?.params?.id;
      }

      if (recordId) {
        await persistLog({ recordId, record, initialRecord });
      }
    }

    return response;
  };

export type CreatePersistLogParams = {
  recordId: string | number;
  record?: BaseRecord | null;
  initialRecord: BaseRecord;
};

const createPersistLogAction =
  (
    request: ActionRequest,
    context: ActionContext,
    options: LoggerActionOptions
  ) =>
  async ({ recordId, record, initialRecord }: CreatePersistLogParams) => {
    const { currentAdmin, _admin, action } = context;
    const { params } = request;
    const {
      propertiesMapping = {},
      userIdAttribute,
      resourceOptions = {
        resourceId: ADMINJS_LOGGER_DEFAULT_RESOURCE_ID,
      },
    } = options ?? {};

    const Log = _admin.findResource(
      resourceOptions.resourceId ?? ADMINJS_LOGGER_DEFAULT_RESOURCE_ID
    );
    const ModifiedResource = _admin.findResource(params.resourceId);

    console.log('currentAdmin', currentAdmin);
    console.log('userIdAttribute', userIdAttribute);

    const adminId = userIdAttribute
      ? currentAdmin?.[userIdAttribute]
      : currentAdmin?.id ?? currentAdmin?._id ?? currentAdmin;

    try {
      if (!adminId) {
        console.error(new AppError(MISSING_USER_ID_ERROR));
      }

      const modifiedRecord =
        record ??
        (await ModifiedResource.findOne(String(recordId), context)) ??
        null;

      const newParamsToCompare = ['delete', 'bulkDelete'].includes(action.name)
        ? ({} as Record<string, any>)
        : (flat.flatten(
            JSON.parse(JSON.stringify(modifiedRecord?.params ?? {}))
          ) as Record<string, any>);
      const logParams = {
        [getLogPropertyName('recordTitle', propertiesMapping)]: getRecordTitle(
          modifiedRecord,
          currentAdmin
        ),
        [getLogPropertyName('resource', propertiesMapping)]: params.resourceId,
        [getLogPropertyName('action', propertiesMapping)]: params.action,
        [getLogPropertyName('recordId', propertiesMapping)]:
          recordId ?? modifiedRecord?.id?.() ?? modifiedRecord?.params?.id,
        [getLogPropertyName('email', propertiesMapping)]: adminId,
        [getLogPropertyName('difference', propertiesMapping)]: JSON.stringify(
          difference(
            newParamsToCompare,
            flat.flatten(
              initialRecord?.params
                ? JSON.parse(JSON.stringify(initialRecord.params))
                : {}
            )
          )
        ),
      };
      console.log('logParams', logParams);
      await Log.create(logParams, context);
    } catch (e) {
      /* The action should not fail nor display a message to the end-user
      but we must log the error in server's console for developers */
      console.error(e);
    }
  };
