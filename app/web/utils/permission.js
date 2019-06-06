import { USER_INFO } from 'constants/StorageKeys';
import storage from './storage';

class PermissionUtil {
  static _permissions = null;

  static get permissions() {
    let permissions = PermissionUtil._permissions;
    if (!permissions) {
      permissions = PermissionUtil.fetchPermissionFromLocalstorage();
      PermissionUtil._permissions = permissions;
    }

    return permissions;
  }

  static fetchPermissionFromLocalstorage() {
    let permissions = storage.getItem(USER_INFO) || '[]';
    try {
      permissions = JSON.parse(permissions).auth_list;
    } catch (ex) {
      permissions = [];
    }

    return permissions;
  }

  static hasPermission(code) {
    const { permissions } = PermissionUtil;
    const hittedIndex = permissions.findIndex(p => +p === +code);
    return hittedIndex > -1;
  }

  static getAllPermissions() {
    const { permissions } = PermissionUtil;
    return permissions;
  }
}

export default PermissionUtil;
