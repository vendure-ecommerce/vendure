import { TestBed } from '@angular/core/testing';

import { LazyLoadStylesheetService } from './lazy-load-stylesheet-service';

describe('LazyLoadStylesheetService', () => {
    describe('lazyLoadStylesheet()', () => {
        let service: LazyLoadStylesheetService;

        beforeEach(() => {
            TestBed.configureTestingModule({});
            service = TestBed.inject(LazyLoadStylesheetService);
        });

        it('appends on document header the lazy loaded stylesheet', () => {
            expect(service['document'].querySelector('head').innerHTML).not.toContain(
                `<link rel="stylesheet" href="lazy-style.css">`,
            );

            service.loadStylesheet('lazy-style.css');

            expect(service['document'].querySelector('head').innerHTML).toContain(
                `<link rel="stylesheet" href="lazy-style.css">`,
            );
        });
    });
});
