/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Layout, Menu, Avatar, Modal, Dropdown, Icon, Button, message } from 'antd';
import { renderRoutes } from 'react-router-config';
import { toJS } from 'mobx';
import { observer, inject } from 'mobx-react';

import { ROLE_ADMIN } from 'enums/Role';
import UpdatePasswordForm from 'components/common/UpdatePasswordForm';


const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@inject(stores => ({
  userStore: stores.userStore,
}))
@observer
class MainContainer extends Component {

  static async fetch(stores) {
    const { userStore } = stores;
    const [currentUser] = await Promise.all([
      userStore.fetchUserSession(),
    ]);

    return { currentUser };
  }

  state = {
    updatePasswordModalVisi: false,
  };

  componentDidMount() {
    const { userStore } = this.props;
    if (userStore) {

    }
  }

  @autobind
  logout() {
    Modal.confirm({
      title: '确定将登出吗?',
      onOk: async () => {
        await this.props.userStore.logout();
        window.location.replace(`/login`);
      },
      okText: '确认',
      cancelText: '取消',
    });
  }

  @autobind
  switchMenu({ key }) {
    const { history } = this.props;
    history.push(key);
  }

  @autobind
  updatePassword() {
    this.updatePasswordForm.props.form.validateFields(async (error, values) => {
      if (error) {
        message.error('条件错误');
      } else {
        const { passwordOld, passwordNew } = values;
        await this.props.userStore.updatePassword({ passwordOld, passwordNew });
        window.location.replace(`/login`);
      }
    });
  }

  @autobind
  closeUpdatePasswordModal() {
    this.setState({ updatePasswordModalVisi: false });
  }

  renderMenu() {
    return (
      <Menu>
        <Menu.Item><a onClick={this.logout}>登出</a></Menu.Item>
        <Menu.Item>
          <a onClick={() => this.setState({ updatePasswordModalVisi: true })}>修改密码</a>
        </Menu.Item>
      </Menu>
    );
  }

  render() {
    const { updatePasswordModalVisi } = this.state;
    const { route, location, userStore } = this.props;
    const menus = [
      { pathname: '/home/dashboard', title: '日志统计', type: 'menuItem' },
      { pathname: '/home/apply', title: '申请管理', type: 'menuItem' },
      { pathname: '/home/log', title: '历史日志', type: 'menuItem' },
      { pathname: '/home/user', title: '用户管理', type: 'menuItem', roles: [ROLE_ADMIN]},
    ];
    const currentUser = toJS(userStore.currentUser);
    let currentMenu = null;
    menus.map(v => {
      if (v.type === 'menuItem' && v.pathname === location.pathname) {
        currentMenu = v;
      } else if (v.type === 'subMenu') {
        v.items.map(v1 => {
          if (v1.type === 'menuItem' && v1.pathname === location.pathname) {
            currentMenu = v1;
          }
        });
      }
    });

    return (
      <Layout className="page-main" style={{ display: 'flex', flexDirection: 'row' }}>
        <Sider>
          <div className="logo"><div>&nbsp;</div></div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[ location.pathname ]}
            onSelect={this.switchMenu}
          >
            {menus.map(v => {
              if (v.roles && v.roles.indexOf(currentUser.role) === -1) {
                return null;
              }

              if (v.type === 'menuItem') {
                return (
                  <Menu.Item key={v.pathname}>
                    <span className="menuItem">
                      <span>{v.title}</span>
                    </span>
                  </Menu.Item>
                );
              } else if (v.type === 'subMenu') {
                return (
                  <SubMenu key={v.pathname} title={<span>{v.title}</span>}>
                    {v.items.map(v1 => (
                      <Menu.Item key={v1.pathname}>
                        <span className="menuItem">
                          <img src={menuImage} style={{ marginRight: 10 }} alt="" />
                          <span>{v1.title}</span>
                        </span>
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              }
            })}
          </Menu>
        </Sider>
        <Layout style={{ overflowY: 'hidden' }}>
          <Header className="header">
            <div className="title">{currentMenu && currentMenu.title}</div>
            <div className="user">
              <Dropdown overlay={this.renderMenu()}>
                <a className="ant-dropdown-link" href="#">
                  <Avatar icon="user" />
                  <span>{userStore.currentUser && userStore.currentUser.userName}</span>
                </a>
              </Dropdown>
            </div>
          </Header>
          <Content style={{ overflowY: 'auto' }}>
            {renderRoutes(route.routes)}
          </Content>
        </Layout>
        <Modal
          className="update-password-modal"
          title="修改密码"
          visible={updatePasswordModalVisi}
          width={400}
          onCancel={this.closeUpdatePasswordModal}
          footer={[
            <Button key="back" onClick={this.closeUpdatePasswordModal}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.updatePassword}>提交</Button>,
          ]}
        >
          <UpdatePasswordForm
            wrappedComponentRef={instance => { this.updatePasswordForm = instance; }}
            updateUser={userStore.currentUser}
          />
        </Modal>
      </Layout>
    );
  }
}

export default MainContainer;
