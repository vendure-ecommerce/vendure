import React from 'react';

import { ServerConfigContext } from '../providers/server-config.js';

export const useServerConfig = () => React.useContext(ServerConfigContext);
