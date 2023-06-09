import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import {
  MessageLengthError,
  ValidMessageContent,
} from '../../domain/message/objects/validMessageContent';
import {
  PersistedMessage,
  persistPostableMessage,
} from '../../domain/message/steps/persistPostableMessage';
import { WorkflowContext } from '../core/workflowContext';
import { createPostableMessage } from '../../domain/message/steps/createPostableMessage';

export type WorkflowInput = {
  message: string;
};

export type WorkflowOutput = TE.TaskEither<
  MessageLengthError,
  PersistedMessage
>;

export type PostMessageWorkflow = (
  ctx: WorkflowContext
) => (input: WorkflowInput) => WorkflowOutput;

export const postMessageWorkflow: PostMessageWorkflow = (ctx) => (input) => {
  const result = pipe(
    input.message,
    createPostableMessage,
    TE.fromEither,
    TE.chainW(persistPostableMessage(ctx.connection))
  );

  return result;
};
