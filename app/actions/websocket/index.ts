// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fetchStatusByIds} from '@actions/remote/user';
import {processPendingPostDeletions} from '@actions/local/post';
import {General} from '@constants';
import DatabaseManager from '@database/manager';
import NetworkManager from '@managers/network_manager';
import {getChannelById} from '@queries/servers/channel';
import {getCurrentUserId} from '@queries/servers/system';
import {getCurrentUser} from '@queries/servers/user';
import {logDebug} from '@utils/log';

export async function handleFirstConnect(serverUrl: string, groupLabel?: BaseRequestGroupLabel) {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const currentUserId = await getCurrentUserId(database);
        const currentUser = await getCurrentUser(database);
        if (currentUser?.isManualStatus) {
            return false;
        }

        // Process any pending post deletions that were queued while offline
        await processPendingPostDeletions(serverUrl);

        // Update the user status
        const client = NetworkManager.getClient(serverUrl);
        await client.updateStatus({
            user_id: currentUserId,
            status: General.ONLINE,
            manual: false,
            last_activity_at: Date.now(),
        }, groupLabel);

        return false;
    } catch (error) {
        logDebug('error on handleFirstConnect', error);
        return error;
    }
}

export async function handleReconnect(serverUrl: string) {
    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const currentUserId = await getCurrentUserId(database);
        const currentUser = await getCurrentUser(database);
        if (currentUser?.isManualStatus) {
            return false;
        }

        // Process any pending post deletions that were queued while offline
        await processPendingPostDeletions(serverUrl);

        // Update the user status
        const client = NetworkManager.getClient(serverUrl);
        await client.updateStatus({
            user_id: currentUserId,
            status: General.ONLINE,
            manual: false,
            last_activity_at: Date.now(),
        });

        return false;
    } catch (error) {
        logDebug('error on handleReconnect', error);
        return error;
    }
}

export async function handleClose(serverUrl: string, connectingState: boolean, shouldReconnect: boolean) {
    if (shouldReconnect) {
        return;
    }

    try {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const currentUserId = await getCurrentUserId(database);
        const currentUser = await getCurrentUser(database);
        if (currentUser?.isManualStatus) {
            return;
        }

        // Update the user status
        const client = NetworkManager.getClient(serverUrl);
        await client.updateStatus({
            user_id: currentUserId,
            status: General.OFFLINE,
            manual: false,
            last_activity_at: Date.now(),
        });
    } catch (error) {
        logDebug('error on handleClose', error);
    }
}

export async function handleEvent(serverUrl: string, msg: WebSocketMessage) {
    const {broadcast, data, event} = msg;

    // Update user status
    if (event === General.WEBSOCKET_AUTHENTICATION_CHALLENGE) {
        return;
    }

    if (event === General.WEBSOCKET_EVENT_STATUS_CHANGE) {
        const userId = data.userId || data.user_id;
        if (userId) {
            fetchStatusByIds(serverUrl, [userId]);
        }
        return;
    }

    // Get the channel from channel id
    if (broadcast?.channel_id) {
        const {database} = DatabaseManager.getServerDatabaseAndOperator(serverUrl);
        const channel = await getChannelById(database, broadcast.channel_id);
        if (channel) {
            const channelId = channel.id;
            if (channelId) {
                // Do something with the channel
            }
        }
    }
}