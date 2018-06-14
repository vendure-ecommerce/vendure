import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { Translatable } from './locale-types';
import { TranslationContructor, TranslationUpdater } from './translation-updater';

@Injectable()
export class TranslationUpdaterService {
    constructor(@InjectEntityManager() private manager: EntityManager) {}

    create<T extends Translatable>(translationCtor: TranslationContructor<T>): TranslationUpdater<T> {
        return new TranslationUpdater(translationCtor, this.manager);
    }
}
