import { Action, ActionResponse } from 'adminjs';
import { CreateLogActionParams } from '../types.js';
export declare const withLogger: (action: Partial<Action<ActionResponse>>, { onlyForPostMethod, options }: CreateLogActionParams) => Partial<Action<ActionResponse>>;
