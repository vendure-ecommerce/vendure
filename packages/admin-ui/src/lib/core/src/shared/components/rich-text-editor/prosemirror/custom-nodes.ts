import { Attrs, DOMParser, DOMSerializer, Node, NodeSpec } from 'prosemirror-model';
import { NodeViewConstructor } from 'prosemirror-view';

export const iframeNode: NodeSpec = {
    group: 'block',
    attrs: {
        allow: {},
        allowfullscreeen: {},
        frameborder: {},
        height: { default: undefined },
        name: { default: '' },
        referrerpolicy: {},
        sandbox: { default: undefined },
        src: {},
        srcdoc: { default: undefined },
        title: { default: undefined },
        width: { default: undefined },
    },
    parseDOM: [
        {
            tag: 'iframe',
            getAttrs: node => {
                if (node instanceof HTMLIFrameElement) {
                    const attrs: Record<string, any> = {
                        allow: node.allow,
                        allowfullscreeen: node.allowFullscreen ?? true,
                        frameborder: node.getAttribute('frameborder'),
                        height: node.height,
                        name: node.name,
                        referrerpolicy: node.referrerPolicy,
                        src: node.src,
                        srcdoc: node.srcdoc || undefined,
                        title: node.title ?? '',
                        width: node.width,
                    };
                    if (node.sandbox.length) {
                        attrs.sandbox = node.sandbox;
                    }
                    return attrs;
                }
                return null;
            },
        },
    ],
    toDOM(node) {
        return ['iframe', { ...node.attrs }];
    },
};

export const iframeNodeView: NodeViewConstructor = (node, view, getPos, decorations) => {
    const domSerializer = DOMSerializer.fromSchema(view.state.schema);
    const wrapper = document.createElement('div');
    wrapper.classList.add('iframe-wrapper');
    const iframe = domSerializer.serializeNode(node);
    wrapper.appendChild(iframe);
    return {
        dom: wrapper,
    };
};
