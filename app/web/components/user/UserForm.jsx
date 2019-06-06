import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { inject, observer } from 'mobx-react';
import { Form, Input, Switch } from 'antd';

import './UserForm.less';

export const USER_FORM_MODE_ADD = 'add';
export const USER_FORM_MODE_UPDATE = 'update';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
};

@inject('userStore')
@observer
class UserForm extends Component {
  resetForm() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { form, user, mode } = this.props;
    const { getFieldDecorator } = form;
    const defaultItemProps = {
      ...formItemLayout,
      colon: false,
      hasFeedback: false,
      help: null,
    };
    const isUpdate = mode === USER_FORM_MODE_UPDATE;

    getFieldDecorator('enabled', { initialValue: user ? user.enabled : 0 });
    getFieldDecorator('id', { initialValue: user ? user.id : '' });

    return (
      <Form className="form-user">
        <FormItem {...defaultItemProps} label="用户名">
          {getFieldDecorator('userName', {
            initialValue: user ? user.userName : '',
            rules: [{
              required: true,
              message: '请输入用户名',
            }],
          })(<Input placeholder="输入用户名" autoComplete="off" readOnly={isUpdate}/>)}
        </FormItem>
        {!isUpdate &&
          <FormItem {...defaultItemProps} label="初始密码">
            {getFieldDecorator('password')(
              <Input placeholder="默认密码为「用户名+watchman」" type="password" />
            )}
          </FormItem>
        }
        <FormItem {...defaultItemProps} label="邮箱地址">
          {getFieldDecorator('email', {
            initialValue: user ? user.email : '',
            rules: [{
              required: true,
              message: '请输入邮箱地址',
            }],
          })(<Input placeholder="输入邮箱地址"/>)}
        </FormItem>
        <FormItem {...defaultItemProps} label="联系电话">
          {getFieldDecorator('phone', {
            initialValue: user ? user.phone : ''
          })(<Input placeholder="输入联系电话"/>)}
        </FormItem>
        <FormItem {...defaultItemProps} label="是否激活">
          <Switch
            checked={Boolean(form.getFieldValue('enabled'))}
            onChange={enabled => form.setFieldsValue({ enabled: Number(enabled) })}
          />
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(UserForm);
