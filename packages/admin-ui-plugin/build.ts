/* tslint:disable:no-console */
import { compileAdminUiApp } from '@vendure/admin-ui/compiler/compile';
import path from 'path';

console.log('Building admin-ui from source...');
compileAdminUiApp(path.join(__dirname, 'lib/admin-ui'), []);
