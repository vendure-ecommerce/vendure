import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { Job } from '../job';

export interface JobBufferStorageStrategy extends InjectableStrategy {
    add(processorId: string, job: Job): Promise<Job>;
    bufferSize(processorIds?: string[]): Promise<{ [processorId: string]: number }>;
    flush(processorIds?: string[]): Promise<{ [processorId: string]: Job[] }>;
}
