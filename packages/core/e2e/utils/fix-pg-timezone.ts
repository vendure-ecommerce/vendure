/**
 * Hack to fix pg driver date handling. See https://github.com/typeorm/typeorm/issues/2622#issuecomment-476416712
 */
export function fixPostgresTimezone() {
    if (process.env.DB === 'postgres') {
        // tslint:disable-next-line:no-var-requires
        const pg = require('pg');
        pg.types.setTypeParser(1114, (stringValue: string) => new Date(`${stringValue}+0000`));
    }
}
