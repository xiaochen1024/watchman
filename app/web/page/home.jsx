import 'styles/pages/home.less';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';

import Layout from 'framework/layout/layout.jsx';
import MainContainer from 'components/MainContainer';
import ApplyManagement from 'components/apply/ApplyManagement';
import LogManagement from 'components/log/LogManagement';
import User from 'components/user/User';
import Dashboard from 'components/dashboard/Dashboard';

import UserStore from 'stores/UserStore';
import ApplyStore from 'stores/ApplyStore';
import LogStore from 'stores/LogStore';
import DashboardStore from 'stores/DashboardStore';

const createStores = (ctx, state) => ({
  userStore: new UserStore(ctx, state),
  applyStore: new ApplyStore(ctx, state),
  logStore: new LogStore(ctx, state),
  dashboardStore: new DashboardStore(ctx, state),
});

const routes = [
  {
    path: '/home',
    component: MainContainer,
    routes: [
      {
        path: '/home/apply',
        component: ApplyManagement,
      },
      {
        path: '/home/log',
        component: LogManagement,
      },
      {
        path: '/home/user',
        component: User,
      },
      {
        path: '/home/dashboard',
        component: Dashboard,
      },
    ],
  },
];

const clientRender = () => {
  const stores = createStores(null, window.__INITIAL_STATE__);
  const Entry = () => (
    <Provider {...stores}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </Provider>
  );
  const render = App => {
    ReactDOM.hydrate(
      EASY_ENV_IS_DEV ? (
        <AppContainer>
          <App />
        </AppContainer>
      ) : (
        <App />
      ),
      document.getElementById('app')
    );
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = async locals => {
  const { ctx, apiConfig } = locals;
  const { url, service } = ctx;
  const stores = createStores(ctx);
  const branch = matchRoutes(routes, url);
  const promises = branch.map(({ route }) => {
    const { fetch } = route.component;
    return fetch instanceof Function ? fetch(stores) : Promise.resolve(null);
  });

  const results = await Promise.all(promises);
  const initialState = await results.reduce((state, result) => {
    Object.assign(state, result);
    return state;
  }, {});
  locals.state = initialState;

  return () => (
    <Layout apiConfig={apiConfig}>
      <Provider {...stores}>
        <StaticRouter location={url} context={{}}>
          {renderRoutes(routes)}
        </StaticRouter>
      </Provider>
    </Layout>
  );
};

serverRender.isWrapped = true;

export default (EASY_ENV_IS_NODE ? serverRender : clientRender());
