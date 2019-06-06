import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Modal, message, Alert } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import omit from 'lodash/omit';

import rcenter from 'utils/requestCenter';
import { formatDate } from 'utils/utils';
import { ROLE_ADMIN } from 'enums/Role';
import ParseErrStackForm from './ParseErrStackForm';
import LogFilterForm from './LogFilterForm';

import './LogManagement.less';

const formatStr = 'yyyy-MM-dd HH:mm:ss';

@inject(stores => ({
  logStore: stores.logStore,
  userStore: stores.userStore,
  applyStore: stores.applyStore,
}))
@observer
class LogManagement extends Component {
  state = {
    loadingLogTable: false,
    parseModalVisi: false,
    errStackArr: [],
    parseLoading: false,
    parseResult: undefined,
  };

  paginationSettings = {
    onChange: this.onPageChange,
    onShowSizeChange: this.onPageChange,
    pageSizeOptions: ['10', '20', '40'],
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: (total, range) => `${range[0]}-${range[1]}条 共${total}条`,
  };

  async componentDidMount() {
    await this.props.applyStore.fetchApplyMap();
    this.refreshTableData();
  }

  parseErrStack = () => {
    this.parseForm.props.form.validateFields(async (err, values) => {
      if (err) {
        message.error('解析参数有误');
        return;
      }
      try {
        this.setState({ parseLoading: true });
        const result = await rcenter.listen(
          this.props.logStore.parseErrStack(values)
        );
        this.setState({ parseResult: JSON.stringify(result) });
      } finally {
        this.setState({ parseLoading: false });
      }
    });
  };

  closeParseModal = () => {
    this.setState({
      parseModalVisi: false,
      parseResult: undefined,
    });
    this.parseForm.resetForm();
  };

  @autobind
  onPageChange(current, size) {
    this.refreshTableData(current, size);
  }

  isAdminUser() {
    const { userStore } = this.props;
    const currentUser = toJS(userStore.currentUser);
    return currentUser && currentUser.role === ROLE_ADMIN;
  }

  getTableColumns() {
    const { applyMap } = this.props.applyStore;
    const cols = [
      {
        title: '项目名称',
        dataIndex: 'id',
        width: 100,
        fixed: 'left',
        render: t => applyMap[t],
      },
      {
        title: '时间',
        dataIndex: 'date',
        width: 200,
        fixed: 'left',
        render: t => formatDate(t, formatStr),
      },
      {
        title: '信息',
        dataIndex: 'msg',
        // width: 400,
      },
      {
        title: 'uin',
        dataIndex: 'uin',
        width: 100,
      },
      {
        title: 'ip',
        dataIndex: 'ip',
        width: 200,
      },
      {
        title: '类型',
        dataIndex: 'userAgent',
        width: 200,
      },
      {
        title: '页面来源',
        dataIndex: 'from',
        width: 200,
      },
      {
        title: '操作',
        width: 100,
        fixed: 'right',
        render: r => {
          const errStackArr = r.msg
            .replace(/\n/gi, '')
            .split('@')
            .slice(1, 9);
          return errStackArr.length > 0 ? (
            <Button
              type="primary"
              onClick={() => {
                this.setState({ parseModalVisi: true, errStackArr });
              }}
            >
              解析
            </Button>
          ) : null;
        },
      },
    ];

    return cols;
  }

  @autobind
  async refreshTableData(current, size) {
    const { logStore } = this.props;
    let { pageNum: currentPage, pageSize } = logStore.logList;
    if (current && size) {
      currentPage = current;
      pageSize = size;
    }

    const filter =
      this.logFilterForm && this.logFilterForm.props.form.getFieldsValue();
    if (filter && filter.date) {
      filter.startDate = formatDate(filter.date[0], formatStr);
      filter.endDate = formatDate(filter.date[1], formatStr);
    }

    this.setState({ loadingLogTable: true });
    try {
      await rcenter.listen(
        logStore.fetchLogList(currentPage, pageSize, omit(filter, ['date']))
      );
    } finally {
      this.setState({ loadingLogTable: false });
    }
  }

  render() {
    const {
      loadingLogTable,
      parseModalVisi,
      errStackArr,
      parseLoading,
      parseResult,
    } = this.state;
    const { logStore, applyStore } = this.props;
    const applyMap = applyStore.applyMap;
    const { docs, pageNum, pageSize, total } = toJS(logStore.logList);
    const pagination = {
      ...this.paginationSettings,
      current: pageNum,
      pageSize,
      total,
    };

    return (
      <div className="page-log">
        <Modal
          className="parseModal"
          title="解析"
          visible={parseModalVisi}
          onCancel={this.closeParseModal}
          footer={[
            <Button
              key="parse"
              onClick={this.parseErrStack}
              loading={parseLoading}
            >
              解析
            </Button>,
          ]}
        >
          <ParseErrStackForm
            errStackArr={errStackArr}
            wrappedComponentRef={instance => {
              this.parseForm = instance;
            }}
          />
          {parseResult && <Alert message={parseResult} type="info" />}
        </Modal>
        <LogFilterForm
          refreshTableData={this.refreshTableData}
          applyMap={applyMap}
          wrappedComponentRef={instance => {
            this.logFilterForm = instance;
          }}
        />
        <Table
          className="logTable"
          dataSource={docs}
          columns={this.getTableColumns()}
          rowKey={r => r._id}
          pagination={pagination}
          loading={loadingLogTable}
          scroll={{ x: 1400 }}
        />
      </div>
    );
  }
}

export default LogManagement;
