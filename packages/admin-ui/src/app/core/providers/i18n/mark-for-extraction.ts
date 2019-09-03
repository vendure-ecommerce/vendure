// tslint:disable:max-line-length
/**
 * The purpose of this function is to mark strings for extraction by ngx-translate-extract.
 * See https://github.com/biesbjerg/ngx-translate-extract/tree/7d5d38e6a17c2232407bf6b0bc65808d5f81208d#mark-strings-for-extraction-using-a-marker-function
 */
export function _<T extends string | string[]>(key: T): T {
    return key;
}
