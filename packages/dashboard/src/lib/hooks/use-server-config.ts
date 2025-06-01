import { ServerConfigContext } from '@/providers/server-config.js';
import React from 'react';

export const useServerConfig = () => React.useContext(ServerConfigContext);
