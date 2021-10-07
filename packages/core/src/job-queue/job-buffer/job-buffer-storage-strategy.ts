import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { Job } from '../job';

export interface JobBufferStorageStrategy extends InjectableStrategy {
    add(processorId: string, job: Job): Promise<Job>;
    bufferSize(bufferIds?: string[]): Promise<{ [bufferId: string]: number }>;
    flush(bufferIds?: string[]): Promise<{ [bufferId: string]: Job[] }>;
}
