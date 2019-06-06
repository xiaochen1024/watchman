import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';

const getXAxis = filters => {
  const { tab } = filters;
  const startTime = new Date(filters.startTime);
  const endTime = new Date(filters.endTime);
  let length = 0; // 日期跨度变量
  if (tab === 0) {
    length =
      (endTime.getTime() - startTime.getTime()) / (1000 * 24 * 60 * 60) + 1;
  } else if (tab === 1) {
    length =
      (endTime.getFullYear() - startTime.getFullYear()) * 12 +
      (endTime.getMonth() - startTime.getMonth()) +
      1;
  } else {
    length = endTime.getFullYear() - startTime.getFullYear() + 1;
  }

  const xAxis = new Array(length);
  xAxis[0] = filters.startTime;
  for (let i = 1; i < length; i++) {
    if (tab === 0) {
      startTime.setDate(startTime.getDate() + 1);
      xAxis[i] = moment(startTime).format(dateFormat);
    } else if (tab === 1) {
      startTime.setMonth(startTime.getMonth() + 1);
      xAxis[i] = moment(startTime).format(dateFormat);
    } else {
      startTime.setFullYear(startTime.getFullYear() + 1);
      xAxis[i] = moment(startTime).format(dateFormat);
    }
  }
  return xAxis;
};

const echartsOptions = {
  title: {
    text: '历史异常',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: [],
  },
  grid: {
    left: '4%',
    right: '6%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [],
};

export default function createLineChartOption(
  applyMap,
  historyList,
  startTime,
  endTime
) {
  const dateArr = getXAxis({ tab: 0, startTime, endTime });
  const applyKeys = Object.keys(applyMap);

  echartsOptions.legend.formatter = function(name) {
    return applyMap[name];
  },
  echartsOptions.legend.data = applyKeys;

  echartsOptions.tooltip.formatter = function(params, ticket, callback) {
    let result = '';
    for (let i = 0; i < params.length; i++) {
      result += `项目${applyMap[params[i].seriesName]}上报数量: ${params[i].value}<br />`;
    }
    return result;
  },
  echartsOptions.xAxis.data = dateArr;

  let dataObj = {};
  if (historyList) {
    if (historyList.length > 0) {
      for (let i = 0; i < historyList.length; i++) {
        const { id, yearMonthDay } = historyList[i]._id;
        dataObj[`${id}_${yearMonthDay}`] = historyList[i];
      }
    } else {
      dataObj = {};
    }
  }

  for (let i = 0; i <  applyKeys.length; i++) {
    echartsOptions.series[i] = {
      name: applyKeys[i],
      type: 'line',
      data: dateArr.map(v => {
        if (dataObj[`${applyKeys[i]}_${v}`]) {
          return dataObj[`${applyKeys[i]}_${v}`].count;
        }
        return 0;
      }),
    };
  }

  echartsOptions.dataZoom = [
    {
      show: true,
      start: 0,
      end: 100,
      showDetail: false,
      bottom: 0,
    },
  ];
  return echartsOptions;
}
