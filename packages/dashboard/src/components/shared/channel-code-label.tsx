import { DEFAULT_CHANNEL_CODE } from '@/constants.js';
import { Trans } from '@lingui/react/macro';

export function ChannelCodeLabel({ code }: { code: string } | { code: undefined }) {
    return code === DEFAULT_CHANNEL_CODE ? <Trans>Default channel</Trans> : code;
}

