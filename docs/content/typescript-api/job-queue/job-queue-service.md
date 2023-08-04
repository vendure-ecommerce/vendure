---
title: "JobQueueService"
weight: 10
date: 2023-07-14T16:57:50.152Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# JobQueueService
<div class="symbol">


# JobQueueService

{{< generation-info sourceFile="packages/core/src/job-queue/job-queue.service.ts" sourceLine="48" packageName="@vendure/core">}}

The JobQueueService is used to create new <a href='/typescript-api/job-queue/#jobqueue'>JobQueue</a> instances and access
existing jobs.

*Example*

```TypeScript
// A service which transcodes video files
class VideoTranscoderService {

  private jobQueue: JobQueue<{ videoId: string; }>;

  async onModuleInit() {
    // The JobQueue is created on initialization
    this.jobQueue = await this.jobQueueService.createQueue({
      name: 'transcode-video',
      process: async job => {
        return await this.transcodeVideo(job.data.videoId);
      },
    });
  }

  addToTranscodeQueue(videoId: string) {
    this.jobQueue.add({ videoId, })
  }

  private async transcodeVideo(videoId: string) {
    // e.g. call some external transcoding service
  }

}
```

## Signature

```TypeScript
class JobQueueService implements OnModuleDestroy {
  constructor(configService: ConfigService, jobBufferService: JobBufferService)
  async createQueue(options: CreateQueueOptions<Data>) => Promise<JobQueue<Data>>;
  async start() => Promise<void>;
  addBuffer(buffer: JobBuffer<any>) => ;
  removeBuffer(buffer: JobBuffer<any>) => ;
  bufferSize(forBuffers: Array<JobBuffer<any> | string>) => Promise<{ [bufferId: string]: number }>;
  flush(forBuffers: Array<JobBuffer<any> | string>) => Promise<Job[]>;
  getJobQueues() => GraphQlJobQueue[];
}
```
## Implements

 * OnModuleDestroy


## Members

### constructor

{{< member-info kind="method" type="(configService: ConfigService, jobBufferService: JobBufferService) => JobQueueService"  >}}

{{< member-description >}}{{< /member-description >}}

### createQueue

{{< member-info kind="method" type="(options: <a href='/typescript-api/job-queue/types#createqueueoptions'>CreateQueueOptions</a>&#60;Data&#62;) => Promise&#60;<a href='/typescript-api/job-queue/#jobqueue'>JobQueue</a>&#60;Data&#62;&#62;"  >}}

{{< member-description >}}Configures and creates a new <a href='/typescript-api/job-queue/#jobqueue'>JobQueue</a> instance.{{< /member-description >}}

### start

{{< member-info kind="method" type="() => Promise&#60;void&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### addBuffer

{{< member-info kind="method" type="(buffer: <a href='/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62;) => "  since="1.3.0" >}}

{{< member-description >}}Adds a <a href='/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>, which will make it active and begin collecting
jobs to buffer.{{< /member-description >}}

### removeBuffer

{{< member-info kind="method" type="(buffer: <a href='/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62;) => "  since="1.3.0" >}}

{{< member-description >}}Removes a <a href='/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>, prevent it from collecting and buffering any
subsequent jobs.{{< /member-description >}}

### bufferSize

{{< member-info kind="method" type="(forBuffers: Array&#60;<a href='/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62; | string&#62;) => Promise&#60;{ [bufferId: string]: number }&#62;"  since="1.3.0" >}}

{{< member-description >}}Returns an object containing the number of buffered jobs arranged by bufferId. This
can be used to decide whether a particular buffer has any jobs to flush.

Passing in JobBuffer instances _or_ ids limits the results to the specified JobBuffers.
If no argument is passed, sizes will be returned for _all_ JobBuffers.

*Example*

```TypeScript
const sizes = await this.jobQueueService.bufferSize('buffer-1', 'buffer-2');

// sizes = { 'buffer-1': 12, 'buffer-2': 3 }
```{{< /member-description >}}

### flush

{{< member-info kind="method" type="(forBuffers: Array&#60;<a href='/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62; | string&#62;) => Promise&#60;<a href='/typescript-api/job-queue/job#job'>Job</a>[]&#62;"  since="1.3.0" >}}

{{< member-description >}}Flushes the specified buffers, which means that the buffer is cleared and the jobs get
sent to the job queue for processing. Before sending the jobs to the job queue,
they will be passed through each JobBuffer's `reduce()` method, which is can be used
to optimize the amount of work to be done by e.g. de-duplicating identical jobs or
aggregating data over the collected jobs.

Passing in JobBuffer instances _or_ ids limits the action to the specified JobBuffers.
If no argument is passed, _all_ JobBuffers will be flushed.

Returns an array of all Jobs which were added to the job queue.{{< /member-description >}}

### getJobQueues

{{< member-info kind="method" type="() => GraphQlJobQueue[]"  >}}

{{< member-description >}}Returns an array of `{ name: string; running: boolean; }` for each
registered JobQueue.{{< /member-description >}}


</div>
