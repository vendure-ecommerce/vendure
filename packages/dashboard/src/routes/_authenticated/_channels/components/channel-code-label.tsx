import { DEFAULT_CHANNEL_CODE } from '@/constants.js';
import { Trans } from '@lingui/react/macro';

export function ChannelCodeLabel({ code }: { code: string } | { code: undefined }) {
    console.log('code', code);
    return code === DEFAULT_CHANNEL_CODE ? <Trans>Default channel</Trans> : code;
}

