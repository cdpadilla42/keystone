import { Checkbox } from '@keystonejs/fields';
import access from '../../access';

export const permissionFields = {
  isAdmin: { type: Checkbox },
  canManageProducts: { type: Checkbox },
  canSeeOtherUsers: { type: Checkbox },
  canManageUsers: { type: Checkbox },
  canManageRoles: { type: Checkbox },
  canManageRoles: { type: Checkbox },
  canManageOrders: { type: Checkbox },
};
