import React, { Component } from 'react';
import { Form, Select, Button, DatePicker, Spin } from 'antd';

const { Item: FormItem } = Form;
const { Option } = Select;
const { RangePicker } = DatePicker;

class LogFilterForm extends Component {
  state = {
    loading: false,
  };
  render() {
    const { form, applyMap } = this.props;
    const { getFieldDecorator } = form;
    const { loading } = this.state;

    return (
      <Spin tip="Loading..." spinning={loading}>
        <Form className="log-filter-form" layout="inline">
          <FormItem help={null} colon={false} hasFeedback key="id" label="项目">
            {getFieldDecorator('id')(
              <Select
                placeholder="请选择项目"
                style={{ width: 200 }}
                allowClear
              >
                {Object.keys(applyMap).map(k => (
                  <Option value={k} key={k}>
                    {applyMap[k]}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <FormItem
            help={null}
            colon={false}
            hasFeedback
            key="date"
            label="时间范围"
          >
            {getFieldDecorator('date', {})(
              <RangePicker
                showTime={{ format: 'HH:mm:ss' }}
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: 320 }}
                placeholder={['开始时间', '结束时间']}
              />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={this.props.refreshTableData}>
              搜索
            </Button>
          </FormItem>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(LogFilterForm);
