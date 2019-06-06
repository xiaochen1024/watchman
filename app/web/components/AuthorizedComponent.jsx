import { Component } from 'react';
import _ from 'lodash';

import PermissionUtil from 'utils/permission';

export const MATCH_SOME = 'match_some';
export const MATCH_ALL = 'match_all';

class AuthorizedComponent extends Component {
  hasPermissions(permissions, mode) {
    const allPermissions = PermissionUtil.getAllPermissions();
    let authorized = false;
    switch (mode) {
    case MATCH_ALL:
      if (_.differenceBy(permissions, allPermissions, Number).length === 0) {
        authorized = true;
      }
      break;
    case MATCH_SOME:
      if (_.intersectionBy(permissions, allPermissions, Number).length > 0) {
        authorized = true;
      }
      break;
    default: break;
    }

    return authorized;
  }

  render() {
    const {
      permissions,
      mode = MATCH_SOME,
      children,
    } = this.props;

    if (this.hasPermissions(permissions, mode)) {
      return children;
    }
    return null;
  }
}

export default AuthorizedComponent;
