import React, { Component } from 'react';
import { Form, Input } from 'antd';

const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class UpdatePasswordForm extends Component {
  state = {
    confirmDirty: false,
  };
  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields([ 'confirm' ], { force: true });
    }
    callback();
  }
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('passwordNew')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }
  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  render() {
    const { form, updateUser, isAdminUpdate } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className="user-add-update-form">
        <FormItem {...formItemLayout} help={null} hasFeedback key="username1" label="用户名">
          {getFieldDecorator('username1', {
            initialValue: updateUser.username,
            rules: [{
              required: true,
              message: 'The input is not valid username!',
            }],
          })(<Input disabled placeholder="请输入用户名" style={{ width: 200 }} />)}
        </FormItem>
        {!isAdminUpdate && <FormItem {...formItemLayout} help={null} hasFeedback key="passwordOld" label="旧密码">
          {getFieldDecorator('passwordOld', {
            rules: [{
              required: true, message: 'Please input your passwordOld!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(<Input placeholder="请输入密码" style={{ width: 200 }} type="password" />)}
        </FormItem>}
        <FormItem {...formItemLayout} help={null} hasFeedback key="passwordNew" label="新密码">
          {getFieldDecorator('passwordNew', {
            rules: [{
              required: true, message: 'Please input your passwordNew!',
            }, {
              validator: this.validateToNextPassword,
            }],
          })(<Input placeholder="请输入密码" style={{ width: 200 }} type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} help={null} hasFeedback key="confirm" label="确认密码">
          {getFieldDecorator('confirm', {
            rules: [{
              required: true, message: 'Please confirm your password!',
            }, {
              validator: this.compareToFirstPassword,
            }],
          })(<Input placeholder="请输入密码" style={{ width: 200 }} type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UpdatePasswordForm);
