import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Switch, Table, Modal, Tag, message } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import moment from 'moment';

import rcenter from 'utils/requestCenter';
import UserForm, { USER_FORM_MODE_ADD, USER_FORM_MODE_UPDATE } from './UserForm';
import { ROLE_ADMIN, ROLE_CUSTOMER } from 'enums/Role';

import './User.less';

@inject(stores => ({
  userStore: stores.userStore,
}))
@observer
class User extends Component {
  state = {
    loadingUserTable: false,
    userFormModalVisiable: false,
    userFormMode: USER_FORM_MODE_ADD,
    savingUser: false,
    editedUser: null,
    pagination: {
      current: 1,
      onChange: this.onPageChange,
      onShowSizeChange: this.onPageChange,
      pageSize: 10,
      pageSizeOptions: ['5', '10', '20', '40'],
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: (total, range) => `${range[0]}-${range[1]}条 共${total}条`,
    },
  };

  componentDidMount() {
    this.refreshUserTableData();
  }

  @autobind
  onUserSave() {
    const { userFormMode } = this.state;
    const { userStore } = this.props;
    const { form } = this.userForm.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      this.setState({ savingUser: true });
      try {
        await rcenter.listen(userStore.saveUser(values));
        this.setState({ userFormModalVisiable: false });
        message.success(
          `${userFormMode === USER_FORM_MODE_ADD ? '添加' : '更新'}用户【${values.userName}】成功`
        );
      } finally {
        this.setState({ savingUser: false });
      }

      this.refreshUserTableData();
    });
  }

  @autobind
  onPageChange(current, size) {
    this.refreshUserTableData(current, size);
  }

  @autobind
  onUserFormModalClose() {
    this.userForm.wrappedInstance.resetForm();
    this.setState({
      userFormMode: USER_FORM_MODE_ADD,
      editedUser: null,
    });
  }

  @autobind
  showUserFormModal() {
    this.setState({ userFormModalVisiable: true });
  }

  @autobind
  hideUserFormModal() {
    this.setState({ userFormModalVisiable: false });
  }

  editUser(user) {
    this.setState({
      userFormModalVisiable: true,
      userFormMode: USER_FORM_MODE_UPDATE,
      editedUser: user,
    });
  }

  getColumnsUser() {
    const cols = [{
      title: '用户名',
      dataIndex: 'userName',
    }, {
      title: '是否激活',
      dataIndex: 'enabled',
      render: (enabled) => <Switch checked={Boolean(enabled)} />
    }, {
      title: '角色',
      dataIndex: 'role',
      render: (t, r) => {
        if (t === 0) {
          return <Tag color="#87d068">普通用户</Tag>;
        } else {
          return <Tag color="#108ee9">管理员</Tag>;
        }
      },
    }, {
      title: '联系电话',
      dataIndex: 'phone',
    }, {
      title: '邮箱地址',
      dataIndex: 'email',
    }, {
      title: '操作',
      render: (t, r) => {
        if (r.role !== ROLE_CUSTOMER) {
          return null;
        }

        return (
          <div className="operator">
            <Button type="primary" icon="edit" size="small" onClick={() => this.editUser(r)}>编辑</Button>
          </div>
        );
      },
    }];

    return cols;
  }

  @autobind
  async refreshUserTableData(current, size) {
    const { userStore } = this.props;
    const pagination = this.state;
    let { current: currentPage, pageSize } = pagination;
    if (current && size) {
      currentPage = current;
      pageSize = size;
    }

    this.setState({ loadingUserTable: true });
    try {
      const list = await rcenter.listen(
        userStore.fetchUserList(currentPage, pageSize),
      );

      pagination.current = currentPage;
      pagination.total = list.count;
      pagination.pageSize = pageSize;
    } finally {
      this.setState({ loadingUserTable: false, pagination });
    }
  }

  render() {
    const {
      userFormMode,
      userFormModalVisiable,
      editedUser,
      savingUser,
      pagination,
      loadingUserTable,
    } = this.state;
    const { userList, currentUser } = this.props.userStore;

    return (
      <div className="page-user">
        {currentUser && currentUser.role === ROLE_ADMIN &&
          <div className="action-container">
            <Button type="primary" onClick={this.showUserFormModal}>新增用户</Button>
          </div>
        }
        <Table
          dataSource={toJS(userList)}
          columns={this.getColumnsUser()}
          rowKey={r => r.id}
          pagination={pagination}
          loading={loadingUserTable}
        />
        <Modal
          className="modal-user"
          title={`${userFormMode === USER_FORM_MODE_ADD ? '新增' : '更新'}用户`}
          width={400}
          maskClosable={false}
          visible={userFormModalVisiable}
          onCancel={this.hideUserFormModal}
          afterClose={this.onUserFormModalClose}
          footer={[
            <Button key="back" onClick={this.hideUserFormModal}>取消</Button>,
            <Button key="submit" type="primary" loading={savingUser} onClick={this.onUserSave}>保存</Button>,
          ]}
        >
          <UserForm
            user={editedUser}
            mode={userFormMode}
            wrappedComponentRef={instance => { this.userForm = instance; }}
          />
        </Modal>
      </div>
    );
  }
}

export default User;
