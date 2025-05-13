// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Database, Q} from '@nozbe/watermelondb';
import {of as of$} from 'rxjs';
import {switchMap} from 'rxjs/operators';

import {MM_TABLES, SYSTEM_IDENTIFIERS} from '@constants/database';
import {logDebug} from '@utils/log';

import type SystemModel from '@typings/database/models/servers/system';

const {SERVER: {SYSTEM}} = MM_TABLES;

export const getCurrentChannelId = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.CURRENT_CHANNEL_ID);
        return system.value;
    } catch {
        return '';
    }
};

export const observeCurrentChannelId = (database: Database) => {
    return database.get<SystemModel>(SYSTEM).query(
        Q.where('id', SYSTEM_IDENTIFIERS.CURRENT_CHANNEL_ID),
    ).observe().pipe(
        switchMap(
            (systems) => {
                if (systems.length) {
                    return of$(systems[0].value);
                }

                return of$('');
            },
        ),
    );
};

export const getLastUnreadChannelId = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.LAST_UNREAD_CHANNEL_ID);
        return system.value;
    } catch {
        return '';
    }
};

export const observeLastUnreadChannelId = (database: Database) => {
    return database.get<SystemModel>(SYSTEM).query(
        Q.where('id', SYSTEM_IDENTIFIERS.LAST_UNREAD_CHANNEL_ID),
    ).observe().pipe(
        switchMap(
            (systems) => {
                if (systems.length) {
                    return of$(systems[0].value);
                }

                return of$('');
            },
        ),
    );
};

export const getCurrentTeamId = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID);
        return system.value;
    } catch {
        return '';
    }
};

export const observeCurrentTeamId = (database: Database) => {
    return database.get<SystemModel>(SYSTEM).query(
        Q.where('id', SYSTEM_IDENTIFIERS.CURRENT_TEAM_ID),
    ).observe().pipe(
        switchMap(
            (systems) => {
                if (systems.length) {
                    return of$(systems[0].value);
                }

                return of$('');
            },
        ),
    );
};

export const getCurrentUserId = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.CURRENT_USER_ID);
        return system.value;
    } catch {
        return '';
    }
};

export const observeCurrentUserId = (database: Database) => {
    return database.get<SystemModel>(SYSTEM).query(
        Q.where('id', SYSTEM_IDENTIFIERS.CURRENT_USER_ID),
    ).observe().pipe(
        switchMap(
            (systems) => {
                if (systems.length) {
                    return of$(systems[0].value);
                }

                return of$('');
            },
        ),
    );
};

export const getConfig = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(MM_TABLES.SERVER.CONFIG);
        return system.value;
    } catch {
        return {};
    }
};

export const getLicense = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.LICENSE);
        return system.value;
    } catch {
        return {};
    }
};

export const getWebSocketLastDisconnected = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.WEBSOCKET);
        return system.value.lastDisconnect;
    } catch {
        return 0;
    }
};

export const getGlobalThreadsTab = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.GLOBAL_THREADS_TAB);
        return system.value;
    } catch {
        return 'all';
    }
};

export const getOnlyUnreads = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.ONLY_UNREADS);
        return system.value;
    } catch {
        return false;
    }
};

export const getTeamHistory = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.TEAM_HISTORY);
        return system.value;
    } catch {
        return [];
    }
};

export const getLastServerVersionCheck = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.LAST_SERVER_VERSION_CHECK);
        return system.value;
    } catch {
        return 0;
    }
};

export const getLastDismissedBanner = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.LAST_DISMISSED_BANNER);
        return system.value;
    } catch {
        return 0;
    }
};

export const getRecentReactions = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.RECENT_REACTIONS);
        return system.value;
    } catch {
        return [];
    }
};

export const getRecentCustomStatus = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.RECENT_CUSTOM_STATUS);
        return system.value;
    } catch {
        return [];
    }
};

export const getRecentMentions = async (database: Database) => {
    try {
        const system = await database.get<SystemModel>(SYSTEM).find(SYSTEM_IDENTIFIERS.RECENT_MENTIONS);
        return system.value;
    } catch {
        return [];
    }
};

export const getSystem = async (database: Database, systemId: string) => {
    try {
        return await database.get<SystemModel>(SYSTEM).find(systemId);
    } catch {
        return undefined;
    }
};

export const prepareCommonSystemValues = (operator: any, values: Record<string, any>) => {
    const models: SystemModel[] = [];
    const systemCollection = operator.database.collections.get(SYSTEM);

    Object.keys(values).forEach((key) => {
        const value = values[key];
        if (value != null) {
            const systemModel = systemCollection.prepareCreate((s: SystemModel) => {
                s.id = key;
                s.value = value;
            });
            models.push(systemModel);
        }
    });

    return models;
};