import { bootstrap } from './core/bootstrap';
import { User } from './core/entities/User';

bootstrap({
    host: '192.168.99.100',
    port: 3306,
    username: 'root',
    password: '',
    database: 'test',
    synchronize: true,
    logging: true,
});
