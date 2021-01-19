/**
 * @description
 * A class which is used to define the contract between the Vendure server and the worker process. Used
 * by the {@link WorkerService} `send` method.
 *
 * @example
 * ```TypeScript
 * export class ReindexMessage extends WorkerMessage<{ ctx: SerializedRequestContext }, boolean> {
 *   static readonly pattern = 'Reindex';
 * }
 *
 * // in a Service running on the main process
 * class MyService {
 *
 *   constructor(private workerService: WorkerService) {}
 *
 *   reindex(ctx: RequestContext): Observable<boolean>> {
 *     // If you need to send the RequestContext object to the worker,
 *     // be sure to send a serialized version to avoid errors.
 *     const serializedCtx = ctx.serialize();
 *     return this.workerService.send(new ReindexMessage({ ctx: serializedCtx }))
 *   }
 * }
 *
 * // in a microservice Controller on the worker process
 * class MyController {
 *
 *  \@MessagePattern(ReindexMessage.pattern)
 *  reindex({ ctx: serializedCtx }: ReindexMessage['data']): Observable<ReindexMessage['response']> {
 *    // Convert the SerializedRequestContext back into a regular
 *    // RequestContext object
 *    const ctx = RequestContext.deserialize(serializedCtx);
 *    // ... some long-running workload
 *  }
 * }
 * ```
 *
 * @docsCategory worker
 */
export abstract class WorkerMessage<T, R> {
    static readonly pattern: string;
    constructor(public data: T) {}
    response: R;
}
