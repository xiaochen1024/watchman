import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { Button, Table, Tag, Modal, message } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import moment from 'moment';

import rcenter from 'utils/requestCenter';
import ApplyForm, { APPLY_FORM_MODE_ADD, APPLY_FORM_MODE_UPDATE } from './ApplyForm';
import ApplyStatus from 'enums/ApplyStatus';
import { ROLE_ADMIN } from 'enums/Role';

import './ApplyManagement.less';

const APPLY_STATUS_COLOR = {
  0: '#2db7f5',
  1: '#87d068',
  2: '#f50',
};

@inject(stores => ({
  applyStore: stores.applyStore,
  userStore: stores.userStore,
}))
@observer
class ApplyManagement extends Component {
  state = {
    loadingApplyTable: false,
    applyFormModalVisiable: false,
    applyFormMode: APPLY_FORM_MODE_ADD,
    savingApply: false,
    editedApply: null,
    updateStatus: null,
  };

  paginationSettings = {
    onChange: this.onPageChange,
    onShowSizeChange: this.onPageChange,
    pageSizeOptions: ['10', '20', '40'],
    showSizeChanger: true,
    showQuickJumper: false,
    showTotal: (total, range) => `${range[0]}-${range[1]}条 共${total}条`,
  };

  componentDidMount() {
    this.refreshTableData();
  }

  @autobind
  onApplySave() {
    const { applyFormMode } = this.state;
    const { applyStore } = this.props;
    const { form } = this.applyForm.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }

      this.setState({ savingApply: true });
      try {
        await rcenter.listen(applyStore.saveApply(values));
        this.setState({ applyFormModalVisiable: false });
        message.success(
          `${applyFormMode === APPLY_FORM_MODE_ADD ? '添加' : '更新'}申请【${values.name}】成功`
        );
      } finally {
        this.setState({ savingApply: false });
      }

      this.refreshTableData();
    });
  }

  @autobind
  onPageChange(current, size) {
    this.refreshTableData(current, size);
  }

  @autobind
  onApplyFormModalClose() {
    this.applyForm.resetForm();
    this.setState({
      applyFormMode: APPLY_FORM_MODE_ADD,
      editedApply: null,
    });
  }

  isAdminUser() {
    const { userStore } = this.props;
    const currentUser = toJS(userStore.currentUser);
    return currentUser && currentUser.role === ROLE_ADMIN;
  }

  @autobind
  showApplyFormModal() {
    this.setState({ applyFormModalVisiable: true });
  }

  @autobind
  hideApplyFormModal() {
    this.setState({ applyFormModalVisiable: false });
  }

  editApply(apply) {
    this.setState({
      applyFormModalVisiable: true,
      applyFormMode: APPLY_FORM_MODE_UPDATE,
      editedApply: apply,
    });
  }

  getTableColumns() {
    const cols = [{
      title: '业务名称',
      dataIndex: 'name',
    }, {
      title: '负责人',
      dataIndex: 'userName',
    }, {
      title: '业务URL',
      dataIndex: 'url',
    }, {
      title: '业务描述',
      dataIndex: 'description',
    }, {
      title: 'appKey',
      dataIndex: 'appKey',
    }, {
      title: '状态',
      dataIndex: 'status',
      render(value) {
        return <Tag color={APPLY_STATUS_COLOR[value]}>{ApplyStatus.getName(value)}</Tag>;
      }
    }];

    if (this.isAdminUser()) {
      cols.push({
        title: '操作',
        render: (_, record) => {
          const { APPLY_APPROVED, APPLY_REJECTED, APPLY_REVIEWING } = ApplyStatus;
          if (record.status !== APPLY_REVIEWING) {
            return null;
          }

          const { updateStatus } = this.state;
          const isUpdating = updateStatus && updateStatus.id === record.id;
          return (
            <div className="operator">
              <Button
                type="primary"
                size="small"
                icon="check"
                loading={isUpdating && updateStatus.status === APPLY_APPROVED}
                onClick={() => this.updateApplyStatus(record, APPLY_APPROVED)}
              >通过</Button>
              <Button
                size="small"
                icon="close"
                loading={isUpdating && updateStatus.status === APPLY_REJECTED}
                onClick={() => this.updateApplyStatus(record, APPLY_REJECTED)}
              >拒绝</Button>
            </div>
          );
        }
      })
    }

    return cols;
  }

  @autobind
  async refreshTableData(current, size) {
    const { applyStore } = this.props;
    let { pageNum: currentPage, pageSize } = applyStore.applyList;
    if (current && size) {
      currentPage = current;
      pageSize = size;
    }

    this.setState({ loadingApplyTable: true });
    try {
      await rcenter.listen(applyStore.fetchApplyList(currentPage, pageSize));
    } finally {
      this.setState({ loadingApplyTable: false });
    }
  }

  async updateApplyStatus(apply, status) {
    const { applyStore } = this.props;
    try {
      this.setState({
        updateStatus: {
          status,
          id: apply.id,
        }
      });
      await rcenter.listen(applyStore.updateApplyStatus(apply.id, status));
      this.refreshTableData();
    } finally {
      this.setState({ updateStatus: null });
    }
  }

  render() {
    const {
      applyFormMode,
      applyFormModalVisiable,
      editedApply,
      savingApply,
      loadingApplyTable,
    } = this.state;
    const { applyStore } = this.props;
    const { list, pageNum, pageSize, total } = toJS(applyStore.applyList);
    const pagination = {
      ...this.paginationSettings,
      current: pageNum,
      pageSize,
      total,
    };

    return (
      <div className="page-apply">
        {!this.isAdminUser() &&
          <div className="action-container">
            <Button type="primary" onClick={this.showApplyFormModal}>申请接入</Button>
          </div>
        }
        <Table
          dataSource={list}
          columns={this.getTableColumns()}
          rowKey={r => r.id}
          pagination={pagination}
          loading={loadingApplyTable}
        />
        <Modal
          className="modal-apply"
          title={`${applyFormMode === APPLY_FORM_MODE_ADD ? '新增' : '更新'}申请`}
          width={400}
          maskClosable={false}
          visible={applyFormModalVisiable}
          onCancel={this.hideApplyFormModal}
          afterClose={this.onApplyFormModalClose}
          footer={[
            <Button key="back" onClick={this.hideApplyFormModal}>取消</Button>,
            <Button key="submit" type="primary" loading={savingApply} onClick={this.onApplySave}>保存</Button>,
          ]}
        >
          <ApplyForm
            apply={editedApply}
            mode={applyFormMode}
            wrappedComponentRef={instance => { this.applyForm = instance; }}
          />
        </Modal>
      </div>
    );
  }
}

export default ApplyManagement;
