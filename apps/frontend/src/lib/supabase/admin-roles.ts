export const ADMIN_ROLES = ['superadmin', 'admin', 'hr'] as const

export type AdminRole = (typeof ADMIN_ROLES)[number]

export function isAdminRole(role: unknown): role is AdminRole {
  return typeof role === 'string' && (ADMIN_ROLES as readonly string[]).includes(role)
}
