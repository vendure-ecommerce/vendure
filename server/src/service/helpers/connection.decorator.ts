import { InjectConnection } from '@nestjs/typeorm';
import { getConnectionManager } from 'typeorm';

import { getConfig } from '../../config/vendure-config';

// TODO: Should be ok to remove this and just use @InjectConnection
export function ActiveConnection() {
    const cm = getConnectionManager();
    return InjectConnection(getConfig().dbConnectionOptions.name);
}
