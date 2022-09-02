import { Injector } from '@angular/core';
import { buildMenuItems, ModalService } from '@vendure/admin-ui/core';
import { menuBar } from 'prosemirror-menu';
import { Schema } from 'prosemirror-model';
import { EditorState, Plugin } from 'prosemirror-state';

export interface CustomMenuPluginOptions {
    floatingMenu?: boolean;
    schema: Schema;
    injector: Injector;
}

export function customMenuPlugin(options: CustomMenuPluginOptions) {
    const modalService = options.injector.get(ModalService);
    const pmMenuBarPlugin = menuBar({
        floating: options.floatingMenu !== false,
        content: buildMenuItems(options.schema, modalService).fullMenu,
    });
    return pmMenuBarPlugin;
}
