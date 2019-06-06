import React, { Component } from 'react';
import { Form, Row, Col, Input } from 'antd';

const { Item: FormItem } = Form;
const { TextArea } = Input;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

export const APPLY_FORM_MODE_ADD = 'add';
export const APPLY_FORM_MODE_UPDATE = 'update';

class ApplyForm extends Component {
  resetForm() {
    const { form } = this.props;
    form.resetFields();
  }

  render() {
    const { form, project, mode } = this.props;
    const { getFieldDecorator } = form;
    const isUpdate = mode === APPLY_FORM_MODE_UPDATE;
    return (
      <Form className="form-project">
        <FormItem {...formItemLayout} help={null} hasFeedback label="项目名称">
          {getFieldDecorator('name', {
            rules: [{ required: true }],
          })(<Input placeholder="请输入项目名称" />)}
        </FormItem>
        <FormItem {...formItemLayout} help={null} hasFeedback label="项目URL">
          {getFieldDecorator('url', {
            rules: [{ required: true }],
          })(<Input placeholder="请输入项目URL地址" />)}
        </FormItem>
        <FormItem {...formItemLayout} help={null} hasFeedback label="项目描述">
          {getFieldDecorator('description')(<TextArea rows={4} placeholder="请输入项目描述" />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ApplyForm);
