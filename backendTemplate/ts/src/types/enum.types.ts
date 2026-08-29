// PLACEHOLDER: rename these two members to your real roles, e.g.
// ADMIN = 'ADMIN', USER = 'USER'. Delete USER entirely if this project
// only ever has one role. If you need a third tier (e.g. staff/moderator),
// add it here and to the ROLE_GROUPS below.
export enum Role {
  ADMIN = '_ROLE_ADMIN_',
  USER = '_ROLE_USER_',
}

// Convenience groups for requireRole(...ROLE_GROUPS.ADMIN_ONLY) calls.
export const ROLE_GROUPS = {
  ADMIN_ONLY: [Role.ADMIN],
  ANY_LOGGED_IN: [Role.ADMIN, Role.USER],
};
