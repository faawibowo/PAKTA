// Utility function to ensure proper camel case role formatting
export function formatUserRole(role: string | undefined | null): string {
  if (!role) return 'Guest'
  
  switch (role.toUpperCase()) {
    case 'LAW':
      return 'Law'
    case 'MANAGEMENT':
      return 'Management' 
    case 'INTERNAL':
      return 'Internal'
    case 'GUEST':
      return 'Guest'
    default:
      // If it's already in correct format, return as is
      if (role === 'Law' || role === 'Management' || role === 'Internal' || role === 'Guest') {
        return role
      }
      // Fallback for unknown roles
      return 'Guest'
  }
}

// Helper function to check if user has access to a specific role requirement
export function hasRoleAccess(userRole: string | undefined | null, requiredRoles: string[]): boolean {
  const formattedRole = formatUserRole(userRole)
  return requiredRoles.includes(formattedRole)
}