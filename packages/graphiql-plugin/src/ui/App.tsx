import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import 'graphiql/graphiql.css';
import React, { useCallback } from 'react';

interface AppProps {
    apiType: 'admin' | 'shop';
}

const App: React.FC<AppProps> = ({ apiType }) => {
    const { adminApiUrl, shopApiUrl } = window.GRAPHIQL_SETTINGS;
    const apiUrl = apiType === 'admin' ? adminApiUrl : shopApiUrl;
    const apiName = apiType === 'admin' ? 'Admin API' : 'Shop API';

    const fetcher = useCallback(() => {
        return createGraphiQLFetcher({
            url: apiUrl,
            subscriptionUrl: apiUrl.replace(/^http/, 'ws'),
        });
    }, [apiUrl]);

    const handleSwitchApi = (newApiType: 'admin' | 'shop') => {
        if (newApiType !== apiType) {
            const pathParts = window.location.pathname.split('/');
            const basePath = pathParts.length > 1 ? `/${pathParts[1]}` : '';

            window.location.href = `${basePath}/${newApiType}`;
        }
    };

    return (
        <div className="graphiql-app">
            <div className="vendure-header">
                <h1>Vendure GraphiQL - {apiName}</h1>
                <div className="switch-api">
                    <span>Switch API:</span>
                    <a
                        href="#"
                        className={apiType === 'admin' ? 'active' : ''}
                        onClick={e => {
                            e.preventDefault();
                            handleSwitchApi('admin');
                        }}
                    >
                        Admin API
                    </a>
                    <a
                        href="#"
                        className={apiType === 'shop' ? 'active' : ''}
                        onClick={e => {
                            e.preventDefault();
                            handleSwitchApi('shop');
                        }}
                    >
                        Shop API
                    </a>
                </div>
            </div>
            <div className="graphiql-wrapper">
                <GraphiQL fetcher={fetcher()} defaultEditorToolsVisibility={true} />
            </div>
        </div>
    );
};

export default App;
