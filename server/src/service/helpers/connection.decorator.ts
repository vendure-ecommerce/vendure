import { InjectConnection } from '@nestjs/typeorm';
import { getConnectionManager } from 'typeorm';

import { getConfig } from '../../config/vendure-config';

export function ActiveConnection() {
    const cm = getConnectionManager();
    return InjectConnection(getConfig().dbConnectionOptions.name);
}
