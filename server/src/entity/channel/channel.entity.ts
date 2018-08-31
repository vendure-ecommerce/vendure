import { DeepPartial } from 'shared/shared-types';
import { Column, Entity } from 'typeorm';

import { VendureEntity } from '../base/base.entity';

@Entity()
export class Channel extends VendureEntity {
    constructor(input?: DeepPartial<Channel>) {
        super(input);
        this.token = this.generateToken();
    }

    @Column({ unique: true })
    code: string;

    @Column({ unique: true })
    token: string;

    private generateToken(): string {
        const randomString = () =>
            Math.random()
                .toString(36)
                .substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
}
