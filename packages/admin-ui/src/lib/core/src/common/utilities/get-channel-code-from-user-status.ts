import { DataService } from '../../data/providers/data.service';

export function getChannelCodeFromUserStatus(dataService: DataService, channelId?: string) {
    return dataService.client
        .userStatus()
        .mapSingle(({ userStatus }) => {
            const channelCode =
                userStatus.channels.find(c => c.id === (channelId ?? userStatus.activeChannelId))?.code ??
                'undefined';
            return { channelCode };
        })
        .toPromise();
}
