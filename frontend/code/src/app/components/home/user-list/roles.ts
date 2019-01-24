export const Roles = {
  admin: 'admin',
  userManager: 'user-manager',
  user: 'user'
};

export const RoleGroups = {
  adminOnly: [Roles.admin],
  adminAnduserManager: [Roles.admin, Roles.userManager],
  all: [Roles.admin, Roles.userManager, Roles.user]
};
