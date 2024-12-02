import { createGraphiQLFetcher } from '@graphiql/toolkit';
import { GraphiQL } from 'graphiql';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'graphiql/graphiql.css';

// this is replaced when the bundled graphiql code is read in
// src/api/config/config-graphql-module.ts
const fetcher = createGraphiQLFetcher({ url: '__API_URL__' });

const root = createRoot(document.getElementById('root'));
root.render(React.createElement(GraphiQL, { fetcher: fetcher }));
