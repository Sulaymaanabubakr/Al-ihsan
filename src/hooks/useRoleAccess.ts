import { useContext } from 'react';
import { AuthContext, type UserRole } from '../context/auth-context';

type TabKey = 'OVERVIEW' | 'CASES' | 'AID_REQUESTS' | 'DONATIONS' | 'DONORS' | 'CAMPAIGNS' | 'FINANCE' | 'GALLERY' | 'VOLUNTEERS' | 'TEAM' | 'CONTENT' | 'NOTIFICATIONS' | 'ANALYTICS' | 'SITE_SETTINGS' | 'AUDIT_LOG';

const ROLE_ACCESS: Record<UserRole, TabKey[]> = {
    SUPER_ADMIN: [
        'OVERVIEW', 'CASES', 'AID_REQUESTS', 'DONATIONS', 'DONORS', 'CAMPAIGNS',
        'FINANCE', 'GALLERY', 'VOLUNTEERS', 'TEAM', 'CONTENT', 'NOTIFICATIONS',
        'ANALYTICS', 'SITE_SETTINGS', 'AUDIT_LOG',
    ],
    FINANCE: [
        'OVERVIEW', 'DONATIONS', 'DONORS', 'CAMPAIGNS', 'FINANCE', 'ANALYTICS', 'NOTIFICATIONS',
    ],
    MODERATOR: [
        'OVERVIEW', 'CASES', 'AID_REQUESTS', 'VOLUNTEERS', 'GALLERY', 'CONTENT', 'NOTIFICATIONS',
    ],
    FIELD_AGENT: [
        'OVERVIEW', 'CASES', 'AID_REQUESTS', 'NOTIFICATIONS',
    ],
};

export const useRoleAccess = () => {
    const { userRole } = useContext(AuthContext);
    const allowedTabs = ROLE_ACCESS[userRole] || ROLE_ACCESS.FIELD_AGENT;

    return {
        userRole,
        allowedTabs,
        canAccess: (tab: TabKey) => allowedTabs.includes(tab),
        isSuperAdmin: userRole === 'SUPER_ADMIN',
    };
};
