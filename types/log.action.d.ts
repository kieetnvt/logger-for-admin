import { ActionResponse, After, BaseRecord, Before } from 'adminjs';
import { CreateLogActionParams } from './types.js';
export declare const rememberInitialRecord: Before;
export declare const createLogAction: ({ onlyForPostMethod, options, }?: CreateLogActionParams) => After<ActionResponse>;
export type CreatePersistLogParams = {
    recordId: string | number;
    record?: BaseRecord | null;
    initialRecord: BaseRecord;
};
