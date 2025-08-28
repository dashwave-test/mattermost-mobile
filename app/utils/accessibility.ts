// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {AccessibilityInfo} from 'react-native';

export async function areAnimationsEnabled(): Promise<boolean> {
    const isReduceMotionEnabled = await AccessibilityInfo.isReduceMotionEnabled();
    return !isReduceMotionEnabled;
}
