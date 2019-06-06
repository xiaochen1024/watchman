import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {
  Layout,
  Form,
  Icon,
  Input,
  Button,
  message,
} from 'antd';


const FormItem = Form.Item;
const { Header, Footer, Content } = Layout;
const formItemLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
};

@inject('userStore')
@observer
class NormalLoginForm extends Component {

  handleSubmit = async e => {
    e.preventDefault();
    const { userStore, form } = this.props;
    const params = form.getFieldsValue();
    if (!(params.username && params.password)) {
      return false;
    }
    try {
      const result = await userStore.login(form.getFieldsValue());
      if (result) {
        window.location.replace(`/home/dashboard`);
      } else {
        message.error('用户名或密码错误');
      }
    } catch (ex) {
      message.error(ex.data.msg);
    }
    return false;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div className="title">登录</div>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{
              required: true,
              message: '请输入用户名',
            }],
          })(<Input
            className="input"
            addonBefore={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="邮箱／账号"
          />)}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{
              required: true,
              message: '请输入登录密码',
            }],
          })(
            <Input
              className="input"
              addonBefore={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="登录密码"
            />
          )}
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);


@inject('userStore')
@observer
class LoginPage extends Component {
  render() {
    return (
      <Layout style={{ height: '100%' }} className="login-page">
        <Header>
          <div className="logo" />
        </Header>
        <Content>
          <WrappedNormalLoginForm history={this.props.history} />
        </Content>
        <Footer></Footer>
      </Layout>
    );
  }
}

export default LoginPage;
