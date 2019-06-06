import React, { Component } from 'react';
import { Card, Button, DatePicker, Spin, Select } from 'antd';
import { observer, inject } from 'mobx-react';
import { toJS } from 'mobx';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react/lib/core';

import createLineChartOptions from './LineChartOptions';

const { RangePicker } = DatePicker;
const { Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';
const now = moment();
const aWeekAgo = moment().subtract(7, 'days');

@inject(stores => ({
  applyStore: stores.applyStore,
  dashboardStore: stores.dashboardStore,
}))
@observer
class Dashboard extends Component {
  state = {
    historyDate: [aWeekAgo, now],
    loading: false,
    dataReady: false,
  };

  async componentDidMount() {
    const { applyStore } = this.props;
    await applyStore.fetchApplyMap();
    this.search();
  }

  changeTime = historyDate => {
    this.setState({ historyDate });
  };

  search = async () => {
    const { historyDate } = this.state;
    const { getHistoryList } = this.props.dashboardStore;
    try {
      this.setState({ loading: true, dataReady: false });
      await getHistoryList({
        startDate: historyDate[0].format(dateFormat),
        endDate: historyDate[1].format(dateFormat),
      });
      this.setState({ dataReady: true });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { dashboardStore, applyStore } = this.props;
    const historyList = toJS(dashboardStore.historyList);
    const applyMap = applyStore.applyMap;
    const { historyDate, loading, dataReady } = this.state;
    return (
      <div className="page-dashboard">
        <Spin tip="Loading..." spinning={loading}>
          <Card title="历史异常统计">
            <RangePicker
              showTime={{ format: 'HH:mm:ss' }}
              format={dateFormat}
              style={{ marginBottom: 20 }}
              allowClear={false}
              value={historyDate}
              placeholder={['开始时间', '结束时间']}
              onChange={this.changeTime}
            />
            <Button onClick={this.search} style={{ marginLeft: 20 }}>
              查询
            </Button>
            {dataReady ? (
              <ReactEcharts
                echarts={echarts}
                option={createLineChartOptions(
                  applyMap,
                  historyList,
                  `${historyDate[0].format('YYYY-MM-DD')}`,
                  `${historyDate[1].format('YYYY-MM-DD')}`
                )}
                style={{ height: '600px', width: '800px', margin: '0px auto' }}
                notMerge
                lazyUpdate
              />
            ) : (
              <div style={{ textAlign: 'center' }}>暂无数据</div>
            )}
          </Card>
        </Spin>
      </div>
    );
  }
}

export default Dashboard;
