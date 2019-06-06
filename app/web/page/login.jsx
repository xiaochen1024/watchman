import 'styles/pages/login.less';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { match, RouterContext } from 'react-router';
import { BrowserRouter, StaticRouter } from 'react-router-dom';
import { matchRoutes, renderRoutes } from 'react-router-config';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';

import LoginPage from 'components/LoginPage';
import Layout from 'framework/layout/layout.jsx';
import UserStore from 'stores/UserStore';

const routes = [{
  path: '/',
  component: LoginPage,
}];

const createStores = (ctx, state) => ({
  userStore: new UserStore(ctx, state),
});

const clientRender = () => {
  const stores = createStores(null, window.__INITIAL_STATE__);
  const Entry = () => (
    <Provider {...stores}>
      <BrowserRouter>
        {renderRoutes(routes)}
      </BrowserRouter>
    </Provider>
  );
  const render = App => {
    const RootComponent = EASY_ENV_IS_DEV ? <AppContainer><App /></AppContainer> : <App />;
    ReactDOM.hydrate(RootComponent, document.getElementById('app'));
  };
  if (EASY_ENV_IS_DEV && module.hot) {
    module.hot.accept();
  }
  render(Entry);
};

const serverRender = (locals) => {
  const { ctx, apiConfig } = locals;
  const stores = createStores(ctx);
  const branch = matchRoutes(routes, ctx.url);
  const promises = branch.map(({ route }) => {
    const fetch = route.component.fetch;
    return fetch instanceof Function ? fetch(stores) : Promise.resolve(null);
  });
  return Promise.all(promises).then(data => {
    return () => (
      <Layout apiConfig={apiConfig}>
        <Provider {...stores}>
          <StaticRouter location={ctx.url} context={{}}>
            {renderRoutes(routes)}
          </StaticRouter>
        </Provider>
      </Layout>
    );
  });
};

serverRender.isWrapped = true;

export default EASY_ENV_IS_NODE ? serverRender : clientRender();
