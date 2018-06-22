import { bootstrap } from './src';
import { IntegerIdStrategy, StringIdStrategy } from './src/config/entity-id-strategy';

/**
 * This bootstraps the dev server, used for testing Vendure during development.
 */
bootstrap({
    port: 3000,
    cors: true,
    dbConnectionOptions: {
        type: 'mysql',
        entities: ['./src/**/entity/**/*.entity.ts'],
        synchronize: true,
        logging: true,
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: 'test',
    },
    // entityIdStrategy: new MadBastardIdStrategy(),
}).catch(err => {
    // tslint:disable-next-line
    console.log(err);
});
