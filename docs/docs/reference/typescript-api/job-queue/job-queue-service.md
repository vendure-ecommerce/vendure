---
title: "JobQueueService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## JobQueueService

<GenerationInfo sourceFile="packages/core/src/job-queue/job-queue.service.ts" sourceLine="48" packageName="@vendure/core" />

The JobQueueService is used to create new <a href='/reference/typescript-api/job-queue/#jobqueue'>JobQueue</a> instances and access
existing jobs.

*Example*

```ts
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

```ts title="Signature"
class JobQueueService implements OnModuleDestroy {
    constructor(configService: ConfigService, jobBufferService: JobBufferService)
    createQueue(options: CreateQueueOptions<Data>) => Promise<JobQueue<Data>>;
    start() => Promise<void>;
    addBuffer(buffer: JobBuffer<any>) => ;
    removeBuffer(buffer: JobBuffer<any>) => ;
    bufferSize(forBuffers: Array<JobBuffer<any> | string>) => Promise<{ [bufferId: string]: number }>;
    flush(forBuffers: Array<JobBuffer<any> | string>) => Promise<Job[]>;
    getJobQueues() => GraphQlJobQueue[];
}
```
* Implements: <code>OnModuleDestroy</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService, jobBufferService: JobBufferService) => JobQueueService`}   />


### createQueue

<MemberInfo kind="method" type={`(options: <a href='/reference/typescript-api/job-queue/types#createqueueoptions'>CreateQueueOptions</a>&#60;Data&#62;) => Promise&#60;<a href='/reference/typescript-api/job-queue/#jobqueue'>JobQueue</a>&#60;Data&#62;&#62;`}   />

Configures and creates a new <a href='/reference/typescript-api/job-queue/#jobqueue'>JobQueue</a> instance.
### start

<MemberInfo kind="method" type={`() => Promise&#60;void&#62;`}   />


### addBuffer

<MemberInfo kind="method" type={`(buffer: <a href='/reference/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62;) => `}  since="1.3.0"  />

Adds a <a href='/reference/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>, which will make it active and begin collecting
jobs to buffer.
### removeBuffer

<MemberInfo kind="method" type={`(buffer: <a href='/reference/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62;) => `}  since="1.3.0"  />

Removes a <a href='/reference/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>, prevent it from collecting and buffering any
subsequent jobs.
### bufferSize

<MemberInfo kind="method" type={`(forBuffers: Array&#60;<a href='/reference/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62; | string&#62;) => Promise&#60;{ [bufferId: string]: number }&#62;`}  since="1.3.0"  />

Returns an object containing the number of buffered jobs arranged by bufferId. This
can be used to decide whether a particular buffer has any jobs to flush.

Passing in JobBuffer instances _or_ ids limits the results to the specified JobBuffers.
If no argument is passed, sizes will be returned for _all_ JobBuffers.

*Example*

```ts
const sizes = await this.jobQueueService.bufferSize('buffer-1', 'buffer-2');

// sizes = { 'buffer-1': 12, 'buffer-2': 3 }
```
### flush

<MemberInfo kind="method" type={`(forBuffers: Array&#60;<a href='/reference/typescript-api/job-queue/job-buffer#jobbuffer'>JobBuffer</a>&#60;any&#62; | string&#62;) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>[]&#62;`}  since="1.3.0"  />

Flushes the specified buffers, which means that the buffer is cleared and the jobs get
sent to the job queue for processing. Before sending the jobs to the job queue,
they will be passed through each JobBuffer's `reduce()` method, which is can be used
to optimize the amount of work to be done by e.g. de-duplicating identical jobs or
aggregating data over the collected jobs.

Passing in JobBuffer instances _or_ ids limits the action to the specified JobBuffers.
If no argument is passed, _all_ JobBuffers will be flushed.

Returns an array of all Jobs which were added to the job queue.
### getJobQueues

<MemberInfo kind="method" type={`() => GraphQlJobQueue[]`}   />

Returns an array of `{ name: string; running: boolean; }` for each
registered JobQueue.


</div>
