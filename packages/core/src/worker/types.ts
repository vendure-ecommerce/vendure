/**
 * @description
 * A class which is used to define the contract between the Vendure server and the worker process. Used
 * by the {@link WorkerService} `send` method.
 *
 * @example
 * ```
 * export class ReindexMessage extends WorkerMessage<{ ctx: RequestContext }, boolean> {
 *     static readonly pattern = 'Reindex';
 * }
 *
 * // in a Service running on the main process
 * class MyService {
 *
 *      constructor(private workerService: WorkerService) {}
 *
 *      reindex(ctx: RequestContext): Observable<boolean>> {
 *          return this.workerService.send(new ReindexMessage({ ctx }))
 *      }
 * }
 *
 * // in a microservice Controller on the worker process
 * class MyController {
 *
 *      \@MessagePattern(ReindexMessage.pattern)
 *      reindex({ ctx: rawContext }: ReindexMessage['data']): Observable<ReindexMessage['response']> {
 *         // ... some long-running workload
 *      }
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
