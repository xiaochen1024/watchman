import React, { Component } from 'react';
import { Form, Select, Button, Upload, Icon } from 'antd';

const { Option } = Select;
const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

class ParseErrStackForm extends Component {
  uploadProps = {
    beforeUpload: file => {
      this.setState({ fileList: [file] });
      return false;
    },
    multiple: false,
  };

  state = {
    fileList: [],
  };

  resetForm() {
    const { form } = this.props;
    form.resetFields();
    this.setState({ fileList: [] });
  }

  render() {
    const { fileList } = this.state;
    const { form, errStackArr } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form className="form-loan-file">
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="errStack"
          label="选择错误栈:"
        >
          {getFieldDecorator('errStack', {
            rules: [{ required: true }],
          })(
            <Select
              placeholder="请选择错误栈"
              style={{ width: 350 }}
              dropdownClassName="errStackOptions"
              dropdownMatchSelectWidth={false}
            >
              {errStackArr.map(p => (
                <Option key={p}>{p}</Option>
              ))}
            </Select>
          )}
        </FormItem>
        <FormItem
          className="form-item-fileupload"
          {...formItemLayout}
          help={null}
          hasFeedback
          key="file"
          label="上传附件:"
        >
          {getFieldDecorator('file', {
            rules: [{ required: true }],
          })(
            <Upload
              {...this.uploadProps}
              fileList={fileList}
              style={{ marginRight: 20 }}
            >
              <Button>
                <Icon type="upload" />
                选择sourcemap文件
              </Button>
            </Upload>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(ParseErrStackForm);
