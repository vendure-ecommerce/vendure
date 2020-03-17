import { Injectable } from '@angular/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';

/**
 * Work-around for Angular 9 compat.
 * See https://github.com/lephyrus/ngx-translate-messageformat-compiler/issues/53#issuecomment-583677994
 */
@Injectable({ providedIn: 'root' })
export class InjectableTranslateMessageFormatCompiler extends TranslateMessageFormatCompiler {}
