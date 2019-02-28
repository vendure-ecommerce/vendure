export function initGraphQlPlaygroundWidgets() {
    Array.from(document.querySelectorAll('.graphql-playground-widget')).forEach(el => {
        const playground = new GraphqlPlaygroundWidget(el as HTMLElement);
        playground.init();
    });
}

/**
 * A widget which lazily creates an iframe containing an instance of the graphql-playground app.
 *
 * The widget can contain one or more tabs with queries defined as below:
 *
 * @example
 * ```
 * <div class="graphql-playground-widget">
 *   <div class="graphql-playground-tab" data-name="Product List">
 *       query {
 *         products(options: { skip: 0 take: 3 }) {
 *           totalItems
 *           items {
 *             name
 *             variants {
 *               sku
 *               name
 *               price
 *             }
 *           }
 *         }
 *       }
 *   </div>
 * </div>
 * ```
 */
export class GraphqlPlaygroundWidget {
    private readonly endpoint = 'https://demo.vendure.io/shop-api';
    private tabs: Array<{ name: string; query: string; }>;
    private triggerYTop: number;
    private triggerYBottom: number;
    private activateTimer: any;
    constructor(private targetElement: HTMLElement) {}

    private scrollHandler = () => {
        clearTimeout(this.activateTimer);
        if (this.triggerYTop < window.scrollY && window.scrollY < this.triggerYBottom) {
            this.activateTimer = setTimeout(() => this.activate(), 250);
        }
    }

    init() {
        const tabElements: HTMLElement[] = Array.from(this.targetElement.querySelectorAll('.graphql-playground-tab'));
        this.tabs = tabElements.map(el => {
            return {
                name: el.dataset.name || 'Query',
                query: this.removeLeadingWhitespace(el.innerHTML),
            };
        });
        this.targetElement.innerHTML = this.loadingHtml;
        this.triggerYTop = this.targetElement.offsetTop - window.innerHeight;
        this.triggerYBottom = this.targetElement.offsetTop + window.innerHeight;
        window.addEventListener('scroll', this.scrollHandler);
        this.scrollHandler();
    }

    activate() {
        this.targetElement.innerHTML = '';
        window.removeEventListener('scroll', this.scrollHandler);
        const iframe = document.createElement('iframe');
        const html = this.generateIframeContent();
        this.targetElement.appendChild(iframe);
        if (iframe.contentWindow) {
            iframe.contentWindow.document.open();
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
        }
    }

    private removeLeadingWhitespace(s: string): string {
        const matches = s.match(/^\s+/m);
        if (!matches) {
            return s;
        }
        const indent = matches[0].replace(/\n/, '');
        return s.replace(new RegExp(`^${indent}`, 'gm'), '').trim();

    }

    private generateIframeContent(): string {
        return this.wrapInHtmlDocument(`
            <script>
            window.addEventListener('load', function (event) {
                GraphQLPlayground.init(document.getElementById('root'), {
                    endpoint: '${this.endpoint}',
                    settings: {
                        'request.credentials': 'include',
                    },
                    tabs: [${this.generateTabsArray()}]
                });
            });
            </script>
        `);
    }

    private generateTabsArray() {
        return this.tabs.map(tab => `
            { endpoint: '${this.endpoint}', name: '${tab.name}', query: \`${tab.query}\` },
        `);
    }

    private wrapInHtmlDocument(toWrap: string): string {
        return `
            <!DOCTYPE html>
            <html>

            <head>
              <meta charset=utf-8/>
              <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
              <title>GraphQL Playground</title>
              <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/css/index.css" />
              <script src="//cdn.jsdelivr.net/npm/graphql-playground-react/build/static/js/middleware.js"></script>
            </head>

            <body>
            <div id="root">
                <style>
                  body {
                    background-color: rgb(23, 42, 58);
                    font-family: Open Sans, sans-serif;
                    height: 90vh;
                  }
                  #root {
                    height: 100%;
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  }
                </style>
            </div>
            ${toWrap}
            </body>
            </html>`;
    }

    private loadingHtml = `<img src='//cdn.jsdelivr.net/npm/graphql-playground-react/build/logo.png' alt=''>
                    <div class="loading"> Loading
                      <span class="title">GraphQL Playground</span>
                    </div>`;
}
