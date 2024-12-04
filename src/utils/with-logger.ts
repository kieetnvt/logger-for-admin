import { Action, ActionResponse, After, Before } from 'adminjs';

import { createLogAction, rememberInitialRecord } from '../log.action.js';
import { CreateLogActionParams } from '../types.js';

export const withLogger = (
  action: Partial<Action<ActionResponse>>,
  { onlyForPostMethod, options }: CreateLogActionParams
): Partial<Action<ActionResponse>> => ({
  ...action,
  before: (Array.isArray(action.before)
    ? [...action.before, rememberInitialRecord]
    : [action.before, rememberInitialRecord]
  ).filter(Boolean) as Before[],
  after: (Array.isArray(action.after)
    ? [...action.after, createLogAction({ onlyForPostMethod, options })]
    : [action.after, createLogAction({ onlyForPostMethod, options })]
  ).filter(Boolean) as After<ActionResponse>[],
});
